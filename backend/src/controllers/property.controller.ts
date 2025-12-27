import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { geminiService } from '../services/gemini.service';

// Mock property dataset for demo
const MOCK_PROPERTIES = [
  {
    id: '1',
    title: '2BR Apartment Near Downtown',
    rent: 1650,
    bedrooms: 2,
    bathrooms: 1,
    location: 'Central Austin',
    estimatedUtilities: 120,
    commuteMinutes: 15,
    landlordRating: 4.2,
    url: 'https://www.zillow.com/homedetails/sample-1'
  },
  {
    id: '2',
    title: 'Modern Studio in Tech District',
    rent: 1200,
    bedrooms: 1,
    bathrooms: 1,
    location: 'Tech Ridge',
    estimatedUtilities: 80,
    commuteMinutes: 25,
    landlordRating: 3.8,
    url: 'https://www.zillow.com/homedetails/sample-2'
  },
  {
    id: '3',
    title: 'Spacious 3BR Family Home',
    rent: 2400,
    bedrooms: 3,
    bathrooms: 2,
    location: 'Suburb Hills',
    estimatedUtilities: 180,
    commuteMinutes: 35,
    landlordRating: 4.7,
    url: 'https://www.zillow.com/homedetails/sample-3'
  },
  {
    id: '4',
    title: 'Renovated 1BR Loft',
    rent: 1400,
    bedrooms: 1,
    bathrooms: 1,
    location: 'Arts District',
    estimatedUtilities: 95,
    commuteMinutes: 20,
    landlordRating: 4.0,
    url: 'https://www.zillow.com/homedetails/sample-4'
  },
  {
    id: '5',
    title: 'Budget-Friendly 2BR',
    rent: 1100,
    bedrooms: 2,
    bathrooms: 1,
    location: 'East Side',
    estimatedUtilities: 110,
    commuteMinutes: 30,
    landlordRating: 3.5,
    url: 'https://www.zillow.com/homedetails/sample-5'
  },
  {
    id: '6',
    title: 'Luxury 2BR with Pool',
    rent: 2800,
    bedrooms: 2,
    bathrooms: 2,
    location: 'Lakefront',
    estimatedUtilities: 150,
    commuteMinutes: 40,
    landlordRating: 4.9,
    url: 'https://www.zillow.com/homedetails/sample-6'
  }
];

export async function searchProperties(req: AuthRequest, res: Response) {
  try {
    const { location, maxRent, bedrooms, income, commuteTarget } = req.body;

    if (!maxRent || !income) {
      return res.status(400).json({ error: 'Max rent and income are required' });
    }

    // Filter properties
    let filteredProperties = MOCK_PROPERTIES.filter(p => p.rent <= maxRent);
    
    if (bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedrooms);
    }

    // Calculate true cost for each property
    const propertiesWithTrueCost = filteredProperties.map(p => ({
      ...p,
      trueMonthlyCost: p.rent + p.estimatedUtilities + (p.commuteMinutes > 20 ? 100 : 0),
      rentBurdenPercentage: ((p.rent + p.estimatedUtilities) * 12 / income) * 100
    }));

    // Sort by best value (lowest burden + highest landlord rating)
    propertiesWithTrueCost.sort((a, b) => {
      const scoreA = a.rentBurdenPercentage * 0.7 - a.landlordRating * 10;
      const scoreB = b.rentBurdenPercentage * 0.7 - b.landlordRating * 10;
      return scoreA - scoreB;
    });

    // Get AI analysis
    const topListings = propertiesWithTrueCost.slice(0, 3);
    const avoidListings = propertiesWithTrueCost.filter(p => 
      p.rentBurdenPercentage > 35 || p.landlordRating < 3.8
    ).slice(0, 2);

    let aiAnalysis = "AI analysis unavailable. Please configure Gemini API key.";
    
    try {
      const prompt = `Analyze these ${topListings.length} rental properties for someone earning $${income}/year:

TOP MATCHES:
${topListings.map((p, i) => `${i + 1}. ${p.title} - $${p.rent}/mo + $${p.estimatedUtilities} utilities = $${p.trueMonthlyCost} true cost (${p.rentBurdenPercentage.toFixed(1)}% of income)`).join('\n')}

${avoidListings.length > 0 ? `AVOID LIST:\n${avoidListings.map(p => `- ${p.title} (${p.rentBurdenPercentage.toFixed(1)}% burden, ${p.landlordRating}/5 rating)`).join('\n')}` : ''}

Provide:
1. Why the #1 pick is best
2. Any red flags to watch for
3. Negotiation tip

Keep it under 200 words, practical and actionable.`;

      aiAnalysis = await geminiService.generateText(prompt);
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
    }

    res.json({
      properties: propertiesWithTrueCost,
      topPicks: topListings,
      avoidList: avoidListings,
      aiAnalysis,
      totalFound: propertiesWithTrueCost.length
    });
  } catch (error: any) {
    console.error('Property search error:', error);
    res.status(500).json({ error: error.message || 'Failed to search properties' });
  }
}
