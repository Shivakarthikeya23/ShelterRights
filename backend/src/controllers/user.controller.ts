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
      // If profile doesn't exist (PGRST116), provide a placeholder instead of crashing
      if (error?.code === "PGRST116") {
        return res.json({
          profile: {
            userId,
            fullName: "",
            isRenter: false,
            isBuyer: false,
            isOwner: false,
            currentMode: "renter",
            needsSetup: true,
          },
          renterData: null,
          buyerData: null,
        });
      }
      throw error;
    }

    // Get additional data based on user type
    let renterData = null;
    let buyerData = null;

    if (profile.is_renter) {
      renterData = await getRenterData(userId);
    }

    if (profile.is_buyer) {
      buyerData = await getBuyerData(userId);
    }

    res.json({
      profile,
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

    const profileData = req.body;
    const updatedProfile = await upsertUserProfile(userId, profileData);

    res.json({ profile: updatedProfile });
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

    res.json({ profile: updatedProfile });
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

    // Update user profile
    const profile = await upsertUserProfile(userId, {
      full_name: fullName,
      annual_income: annualIncome,
      location_city: locationCity,
      location_state: locationState,
      location_zip: locationZip,
      is_renter: isRenter,
      is_buyer: isBuyer,
      is_owner: isOwner,
      current_mode: currentMode,
    });

    // Create renter data if applicable
    if (isRenter && renterData) {
      await supabase.from("renter_data").upsert({
        user_id: userId,
        ...renterData,
      });
    }

    // Create buyer data if applicable
    if (isBuyer && buyerData) {
      await supabase.from("buyer_data").upsert({
        user_id: userId,
        ...buyerData,
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Setup profile error:", error);
    res.status(500).json({ error: error.message || "Failed to setup profile" });
  }
}
