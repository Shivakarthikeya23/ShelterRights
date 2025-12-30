import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder_key');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  private hasValidKey(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return !!key && key !== 'your_gemini_api_key_here' && key !== 'placeholder_key';
  }

  // Chat with tenant rights assistant
  async chatTenantRights(userMessage: string, state: string): Promise<string> {
    if (!this.hasValidKey()) {
      return `**Tenant Rights Information for ${state}**\n\nBased on your question about "${userMessage}", here are some general guidelines:\n\n• Most states require landlords to provide 24-48 hours notice before entering your unit (except emergencies)\n• You have the right to a habitable dwelling with working utilities\n• Security deposits must be returned within 14-30 days (varies by state)\n• Rent increases typically require 30-60 days written notice\n\nFor specific legal advice about your situation in ${state}, I recommend contacting your local tenant rights organization or legal aid office. Many offer free consultations.\n\n*Note: AI analysis is currently limited. The information above is general guidance.*`;
    }

    try {
      const prompt = `You are a helpful tenant rights expert for ${state}. 
A tenant has this question: "${userMessage}"

Provide accurate, actionable advice about tenant rights in ${state}. Include:
1. A clear answer to their question
2. Relevant laws or regulations (if applicable)
3. Actionable next steps
4. When to seek legal help

Keep your response friendly, clear, and under 300 words.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      return "I encountered an error while processing your request. Please try again later.";
    }
  }

  // Analyze rent burden situation
  async analyzeRentBurden(data: {
    income: number;
    rent: number;
    location: string;
    burdenPercentage: number;
  }): Promise<string> {
    if (!this.hasValidKey()) {
      // Provide helpful fallback analysis based on burden percentage
      const burden = data.burdenPercentage;
      let analysis = `**Based on your ${burden.toFixed(1)}% rent burden:**\n\n`;
      
      if (burden < 30) {
        analysis += `✅ Excellent! Your housing costs are well within the recommended 30% guideline. This leaves you with financial flexibility for savings, emergencies, and other goals.\n\n**Suggestions:**\n• Continue building your emergency fund (aim for 3-6 months expenses)\n• Consider increasing retirement contributions\n• You're in a good position to save for future goals like homeownership`;
      } else if (burden < 40) {
        analysis += `⚠️ Your rent burden is slightly elevated. While manageable, this may limit your financial flexibility.\n\n**Suggestions:**\n• Look for ways to increase income (side gigs, negotiating raise)\n• Consider finding a roommate to split costs\n• Review your budget for other areas to cut back\n• Even reducing rent by $200-300/month could significantly improve your financial health`;
      } else {
        analysis += `🚨 Your rent burden is significantly above the recommended 30%. This may be causing financial stress and limiting your ability to save.\n\n**Urgent Suggestions:**\n• Actively search for more affordable housing options\n• Consider relocating to a lower-cost neighborhood\n• Look into rent assistance programs in ${data.location}\n• Explore income opportunities to increase earnings\n• Connect with local tenant advocacy groups for resources`;
      }
      
      analysis += `\n\n*Note: For personalized AI-powered financial advice, configure the Gemini API key in backend settings.*`;
      return analysis;
    }

    try {
      const prompt = `A person earning $${data.income}/year pays $${data.rent}/month in rent in ${data.location}.
Their rent burden is ${data.burdenPercentage.toFixed(1)}% (guideline is 30%).

Provide a 2-paragraph analysis:
1. What this means for their financial health
2. Specific suggestions to improve their situation

Be empathetic, practical, and under 200 words.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini analysis error:', error);
      return "AI Analysis is currently unavailable. However, your logic-based calculations above are accurate.";
    }
  }

  // Generate campaign description
  async generateCampaignDescription(campaignTitle: string, location: string): Promise<string> {
    if (!this.hasValidKey()) {
      return `**${campaignTitle}**\n\nJoin us in ${location} as we fight for fair housing practices and tenant rights. This campaign aims to bring about positive change in our community by addressing critical housing issues that affect working families.\n\n**Why This Matters:**\nRising housing costs are pushing families out of their homes and communities. By coming together, we can make our voices heard and demand accountability from landlords and policymakers.\n\n**Take Action:**\nSign this petition to show your support. Every signature brings us closer to achieving real change. Together, we can create a community where everyone has access to safe, affordable housing.\n\n*Note: Configure Gemini API key for AI-generated custom descriptions.*`;
    }

    try {
      const prompt = `Generate a compelling 2-3 paragraph description for a tenant rights campaign titled "${campaignTitle}" in ${location}.

Include:
- Why this matters
- What change is being sought
- Call to action for supporters

Keep it under 250 words, passionate but professional.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini description error:', error);
      return `Support our campaign for "${campaignTitle}" in ${location}! We are working together to improve housing conditions and protect tenant rights in our community. Join us in making a difference.`;
    }
  }

  // Generic text generation (for custom prompts)
  async generateText(prompt: string): Promise<string> {
    if (!this.hasValidKey()) {
      throw new Error('Gemini API key not configured');
    }

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

export const geminiService = new GeminiService();
