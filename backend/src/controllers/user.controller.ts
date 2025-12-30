import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getUserProfile,
  upsertUserProfile,
  getRenterData,
  getBuyerData,
  supabase,
} from "../services/supabase.service";

// Get current user profile
export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let profile;
    try {
      profile = await getUserProfile(userId);
    } catch (error: any) {
      // If profile doesn't exist (PGRST116), create one with all modes enabled
      if (error?.code === "PGRST116") {
        try {
          // Create profile with all modes enabled by default
          const newProfile = await upsertUserProfile(userId, {
            is_renter: true,
            is_buyer: true,
            is_owner: true,
            current_mode: 'renter'
          });
          
          // Transform and return
          const transformedProfile = {
            id: newProfile.id,
            userId: newProfile.user_id,
            fullName: newProfile.full_name || null,
            isRenter: newProfile.is_renter || false,
            isBuyer: newProfile.is_buyer || false,
            isOwner: newProfile.is_owner || false,
            isAdvocate: newProfile.is_advocate || false,
            currentMode: newProfile.current_mode || 'renter',
            annualIncome: newProfile.annual_income ? parseFloat(newProfile.annual_income.toString()) : null,
            locationCity: newProfile.location_city || null,
            locationState: newProfile.location_state || null,
            locationZip: newProfile.location_zip || null,
            savedSearches: newProfile.saved_searches || {},
            emailNotifications: newProfile.email_notifications !== false,
            createdAt: newProfile.created_at,
            updatedAt: newProfile.updated_at
          };
          
          return res.json({
            profile: transformedProfile,
            renterData: null,
            buyerData: null,
          });
        } catch (createError: any) {
          // If creation fails, return placeholder
          return res.json({
            profile: {
              userId,
              fullName: "",
              isRenter: true,
              isBuyer: true,
              isOwner: true,
              currentMode: "renter",
              needsSetup: true,
            },
            renterData: null,
            buyerData: null,
          });
        }
      }
      throw error;
    }

    // Transform database response (snake_case) to frontend format (camelCase)
    const transformedProfile = {
      id: profile.id,
      userId: profile.user_id,
      fullName: profile.full_name || null,
      isRenter: profile.is_renter || false,
      isBuyer: profile.is_buyer || false,
      isOwner: profile.is_owner || false,
      isAdvocate: profile.is_advocate || false,
      currentMode: profile.current_mode || 'renter',
      annualIncome: profile.annual_income ? parseFloat(profile.annual_income.toString()) : null,
      locationCity: profile.location_city || null,
      locationState: profile.location_state || null,
      locationZip: profile.location_zip || null,
      savedSearches: profile.saved_searches || {},
      emailNotifications: profile.email_notifications !== false,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };

    // Get additional data based on user type
    let renterData = null;
    let buyerData = null;

    // Try to get renter data, but don't fail if table doesn't exist
    if (profile.is_renter) {
      try {
        renterData = await getRenterData(userId);
      } catch (error: any) {
        console.log('Renter data table not available yet or no data found');
      }
    }

    // Try to get buyer data, but don't fail if table doesn't exist
    if (profile.is_buyer) {
      try {
        buyerData = await getBuyerData(userId);
      } catch (error: any) {
        console.log('Buyer data table not available yet or no data found');
      }
    }

    res.json({
      profile: transformedProfile,
      renterData,
      buyerData,
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: error.message || "Failed to get profile" });
  }
}

// Update user profile
export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      fullName,
      annualIncome,
      locationCity,
      locationState,
      locationZip,
      isRenter,
      isBuyer,
      isOwner,
      currentMode,
      ...otherData
    } = req.body;

    // Convert camelCase to snake_case for database
    const profileData: any = {};
    
    if (fullName !== undefined) profileData.full_name = fullName;
    if (annualIncome !== undefined) profileData.annual_income = annualIncome;
    if (locationCity !== undefined) profileData.location_city = locationCity;
    if (locationState !== undefined) profileData.location_state = locationState;
    if (locationZip !== undefined) profileData.location_zip = locationZip;
    if (isRenter !== undefined) profileData.is_renter = isRenter;
    if (isBuyer !== undefined) profileData.is_buyer = isBuyer;
    if (isOwner !== undefined) profileData.is_owner = isOwner;
    if (currentMode !== undefined) profileData.current_mode = currentMode;
    
    // Include any other fields that might be passed
    Object.assign(profileData, otherData);

    const updatedProfile = await upsertUserProfile(userId, profileData);

    // Transform to camelCase for frontend
    const transformedProfile = {
      id: updatedProfile.id,
      userId: updatedProfile.user_id,
      fullName: updatedProfile.full_name || null,
      isRenter: updatedProfile.is_renter || false,
      isBuyer: updatedProfile.is_buyer || false,
      isOwner: updatedProfile.is_owner || false,
      isAdvocate: updatedProfile.is_advocate || false,
      currentMode: updatedProfile.current_mode || 'renter',
      annualIncome: updatedProfile.annual_income ? parseFloat(updatedProfile.annual_income.toString()) : null,
      locationCity: updatedProfile.location_city || null,
      locationState: updatedProfile.location_state || null,
      locationZip: updatedProfile.location_zip || null,
      savedSearches: updatedProfile.saved_searches || {},
      emailNotifications: updatedProfile.email_notifications !== false,
      createdAt: updatedProfile.created_at,
      updatedAt: updatedProfile.updated_at
    };

    res.json({ profile: transformedProfile });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
}

// Switch user mode (renter/buyer/owner)
export async function switchMode(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { mode } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!["renter", "buyer", "owner"].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode" });
    }

    const updatedProfile = await upsertUserProfile(userId, {
      current_mode: mode,
    });

    // Transform to camelCase for frontend
    const transformedProfile = {
      id: updatedProfile.id,
      userId: updatedProfile.user_id,
      fullName: updatedProfile.full_name || null,
      isRenter: updatedProfile.is_renter || false,
      isBuyer: updatedProfile.is_buyer || false,
      isOwner: updatedProfile.is_owner || false,
      isAdvocate: updatedProfile.is_advocate || false,
      currentMode: updatedProfile.current_mode || 'renter',
      annualIncome: updatedProfile.annual_income ? parseFloat(updatedProfile.annual_income.toString()) : null,
      locationCity: updatedProfile.location_city || null,
      locationState: updatedProfile.location_state || null,
      locationZip: updatedProfile.location_zip || null,
      savedSearches: updatedProfile.saved_searches || {},
      emailNotifications: updatedProfile.email_notifications !== false,
      createdAt: updatedProfile.created_at,
      updatedAt: updatedProfile.updated_at
    };

    res.json({ profile: transformedProfile });
  } catch (error: any) {
    console.error("Switch mode error:", error);
    res.status(500).json({ error: error.message || "Failed to switch mode" });
  }
}

// Setup profile (first-time onboarding)
export async function setupProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const {
      fullName,
      annualIncome,
      locationCity,
      locationState,
      locationZip,
      isRenter,
      isBuyer,
      isOwner,
      currentMode,
      // Renter-specific
      renterData,
      // Buyer-specific
      buyerData,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Update user profile (upsert will handle existing or new)
    const profile = await upsertUserProfile(userId, {
      full_name: fullName || null,
      annual_income: annualIncome || null,
      location_city: locationCity || null,
      location_state: locationState || null,
      location_zip: locationZip || null,
      is_renter: isRenter !== undefined ? isRenter : true,
      is_buyer: isBuyer !== undefined ? isBuyer : true,
      is_owner: isOwner !== undefined ? isOwner : true,
      current_mode: currentMode || 'renter',
    });

    // Create renter data if applicable (with error handling)
    if (isRenter && renterData) {
      try {
        await supabase.from("renter_data").upsert({
          user_id: userId,
          ...renterData,
        });
      } catch (error: any) {
        console.log('Could not create renter data - table may not exist yet');
      }
    }

    // Create buyer data if applicable (with error handling)
    if (isBuyer && buyerData) {
      try {
        await supabase.from("buyer_data").upsert({
          user_id: userId,
          ...buyerData,
        });
      } catch (error: any) {
        console.log('Could not create buyer data - table may not exist yet');
      }
    }

    // Transform to camelCase for frontend
    const transformedProfile = {
      id: profile.id,
      userId: profile.user_id,
      fullName: profile.full_name || null,
      isRenter: profile.is_renter || false,
      isBuyer: profile.is_buyer || false,
      isOwner: profile.is_owner || false,
      isAdvocate: profile.is_advocate || false,
      currentMode: profile.current_mode || 'renter',
      annualIncome: profile.annual_income ? parseFloat(profile.annual_income.toString()) : null,
      locationCity: profile.location_city || null,
      locationState: profile.location_state || null,
      locationZip: profile.location_zip || null,
      savedSearches: profile.saved_searches || {},
      emailNotifications: profile.email_notifications !== false,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };

    res.json({
      success: true,
      profile: transformedProfile,
    });
  } catch (error: any) {
    console.error("Setup profile error:", error);
    res.status(500).json({ error: error.message || "Failed to setup profile" });
  }
}
