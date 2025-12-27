import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder_key');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  private hasValidKey(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return !!key && key !== 'your_gemini_api_key_here' && key !== 'placeholder_key';
  }

  // Chat with tenant rights assistant
  async chatTenantRights(userMessage: string, state: string): Promise<string> {
    if (!this.hasValidKey()) {
      return "I'm sorry, I cannot provide AI assistance at the moment because the Gemini API key is not configured. Please contact the administrator.";
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
      return "Unable to provide AI analysis at this time. Please ensure your Gemini API key is correctly configured in the backend .env file.";
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
      return `This is a placeholder description for the campaign "${campaignTitle}" in ${location}. Please configure the Gemini API key to generate an AI-powered description.`;
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
