import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabase } from '../services/supabase.service';
import { geminiService } from '../services/gemini.service';

// Calculate rent burden
export async function calculateRentBurden(req: AuthRequest, res: Response) {
  try {
    const { annualIncome, monthlyRent, locationCity, locationState } = req.body;
    const userId = req.user?.id;

    if (!annualIncome || !monthlyRent) {
      return res.status(400).json({ error: 'Income and rent are required' });
    }

    // Calculate metrics
    const burdenPercentage = (monthlyRent * 12 / annualIncome) * 100;
    const recommendedRent = (annualIncome * 0.30) / 12;
    const monthlyOverpayment = Math.max(0, monthlyRent - recommendedRent);
    const annualOverpayment = monthlyOverpayment * 12;

    // Get AI analysis - Handled with try/catch to ensure calculations are returned even if AI fails
    let aiAnalysis = "AI Analysis is currently unavailable. Please verify your Gemini API key.";
    try {
      aiAnalysis = await geminiService.analyzeRentBurden({
        income: annualIncome,
        rent: monthlyRent,
        location: `${locationCity || 'Unknown City'}, ${locationState || 'Unknown State'}`,
        burdenPercentage
      });
    } catch (aiError) {
      console.error('AI Analysis failed, but continuing with calculations:', aiError);
    }

    // Save to database if user is logged in
    if (userId) {
      try {
        await supabase.from('rent_calculations').insert({
          user_id: userId,
          annual_income: annualIncome,
          monthly_rent: monthlyRent,
          location_city: locationCity,
          location_state: locationState,
          burden_percentage: burdenPercentage,
          monthly_overpayment: monthlyOverpayment,
          annual_overpayment: annualOverpayment,
          recommended_rent: recommendedRent,
          ai_analysis: aiAnalysis
        });
      } catch (dbError) {
        console.error('Failed to save calculation to database:', dbError);
      }
    }

    res.json({
      burdenPercentage: burdenPercentage.toFixed(1),
      recommendedRent: Math.round(recommendedRent),
      monthlyOverpayment: Math.round(monthlyOverpayment),
      annualOverpayment: Math.round(annualOverpayment),
      aiAnalysis,
      isHealthy: burdenPercentage < 30
    });
  } catch (error: any) {
    console.error('Calculate rent burden error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate' });
  }
}

// Get calculation history
export async function getCalculationHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data, error } = await supabase
      .from('rent_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json({ calculations: data });
  } catch (error: any) {
    console.error('Get calculation history error:', error);
    res.status(500).json({ error: error.message || 'Failed to get history' });
  }
}

// Chat with tenant rights assistant
export async function chatTenantRights(req: AuthRequest, res: Response) {
  try {
    const { message, state } = req.body;
    const userId = req.user?.id;

    if (!message || !state) {
      return res.status(400).json({ error: 'Message and state are required' });
    }

    // Get AI response
    const aiResponse = await geminiService.chatTenantRights(message, state);

    // Save chat history if user is logged in
    if (userId) {
      try {
        // Get existing chat history
        const { data: existingChat } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', userId)
          .eq('state', state)
          .single();

        const messages = existingChat?.messages || [];
        messages.push(
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
        );

        if (existingChat) {
          await supabase
            .from('chat_history')
            .update({ messages, updated_at: new Date().toISOString() })
            .eq('id', existingChat.id);
        } else {
          await supabase.from('chat_history').insert({
            user_id: userId,
            state,
            messages
          });
        }
      } catch (dbError) {
        console.error('Failed to save chat history:', dbError);
      }
    }

    res.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Chat tenant rights error:', error);
    res.status(500).json({ error: error.message || 'Failed to chat' });
  }
}

// Get chat history
export async function getChatHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { state } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const query = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId);

    if (state) {
      query.eq('state', state as string);
    }

    const { data, error } = await (query as any).order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({ history: data });
  } catch (error: any) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: error.message || 'Failed to get history' });
  }
}

// Get campaigns
export async function getCampaigns(req: AuthRequest, res: Response) {
  try {
    const { city, state, status = 'active' } = req.query;

    let query = supabase
      .from('campaigns')
      .select('*, signatures(count)')
      .eq('status', status as string);

    if (city) query = query.eq('location_city', city as string);
    if (state) query = query.eq('location_state', state as string);

    const { data, error } = await (query as any).order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ campaigns: data });
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: error.message || 'Failed to get campaigns' });
  }
}

// Create campaign
export async function createCampaign(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { title, description, locationCity, locationState, locationZip, goalSignatures } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Generate description if not provided
    let finalDescription = description;
    if (!finalDescription) {
      finalDescription = await geminiService.generateCampaignDescription(
        title,
        `${locationCity}, ${locationState}`
      );
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        creator_id: userId,
        title,
        description: finalDescription,
        location_city: locationCity,
        location_state: locationState,
        location_zip: locationZip,
        goal_signatures: goalSignatures || 100
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ campaign: data });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: error.message || 'Failed to create campaign' });
  }
}

// Sign campaign
export async function signCampaign(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { campaignId } = req.params;
    const { isAnonymous, fullName } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if already signed
    const { data: existing } = await supabase
      .from('signatures')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already signed this campaign' });
    }

    const { data, error } = await supabase
      .from('signatures')
      .insert({
        campaign_id: campaignId,
        user_id: userId,
        is_anonymous: isAnonymous,
        full_name: fullName
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ signature: data });
  } catch (error: any) {
    console.error('Sign campaign error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign campaign' });
  }
}
