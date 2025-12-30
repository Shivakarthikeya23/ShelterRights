import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { geminiService } from '../services/gemini.service';

// Helper function to generate location-based properties
const generatePropertiesForLocation = (city: string, state: string, type: 'rental' | 'purchase') => {
  const cityLower = city?.toLowerCase() || '';
  const stateLower = state?.toLowerCase() || '';
  
  if (type === 'rental') {
    return [
      {
        id: '1',
        title: `2BR Apartment Near Downtown ${city || ''}`,
        rent: 1650,
        bedrooms: 2,
        bathrooms: 1,
        location: `Central ${city || 'Area'}`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        estimatedUtilities: 120,
        commuteMinutes: 15,
        landlordRating: 4.2,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: '2',
        title: `Modern Studio in ${city || 'Tech District'}`,
        rent: 1200,
        bedrooms: 1,
        bathrooms: 1,
        location: `${city || 'Tech'} District`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        estimatedUtilities: 80,
        commuteMinutes: 25,
        landlordRating: 3.8,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: '3',
        title: `Spacious 3BR Family Home in ${city || 'Suburbs'}`,
        rent: 2400,
        bedrooms: 3,
        bathrooms: 2,
        location: `${city || 'Suburban'} Area`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        estimatedUtilities: 180,
        commuteMinutes: 35,
        landlordRating: 4.7,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: '4',
        title: `Renovated 1BR Loft in ${city || 'Downtown'}`,
        rent: 1400,
        bedrooms: 1,
        bathrooms: 1,
        location: `${city || 'Arts'} District`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        estimatedUtilities: 95,
        commuteMinutes: 20,
        landlordRating: 4.0,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: '5',
        title: `Budget-Friendly 2BR in ${city || 'East Side'}`,
        rent: 1100,
        bedrooms: 2,
        bathrooms: 1,
        location: `${city || 'East'} Side`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        estimatedUtilities: 110,
        commuteMinutes: 30,
        landlordRating: 3.5,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: '6',
        title: `Luxury 2BR with Pool in ${city || 'Lakefront'}`,
        rent: 2800,
        bedrooms: 2,
        bathrooms: 2,
        location: `${city || 'Lakefront'} Area`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        estimatedUtilities: 150,
        commuteMinutes: 40,
        landlordRating: 4.9,
        url: '#demo-property',
        isDemoData: true
      }
    ];
  } else {
    return [
      {
        id: 's1',
        title: `Charming 3BR Starter Home in ${city || 'Suburbs'}`,
        price: 280000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1500,
        location: `${city || 'Suburban'} Neighborhood`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        yearBuilt: 1995,
        propertyType: 'Single Family',
        estimatedMonthlyPayment: 1850,
        estimatedPropertyTax: 350,
        estimatedInsurance: 120,
        estimatedMaintenance: 200,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: 's2',
        title: `Modern 2BR Condo in ${city || 'Downtown'}`,
        price: 220000,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        location: `${city || 'Downtown'} District`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        yearBuilt: 2010,
        propertyType: 'Condo',
        estimatedMonthlyPayment: 1450,
        estimatedPropertyTax: 280,
        estimatedInsurance: 100,
        estimatedMaintenance: 150,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: 's3',
        title: `Spacious 4BR Family Home in ${city || 'Family Area'}`,
        price: 380000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2200,
        location: `${city || 'Family-Friendly'} Area`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        yearBuilt: 2005,
        propertyType: 'Single Family',
        estimatedMonthlyPayment: 2500,
        estimatedPropertyTax: 500,
        estimatedInsurance: 180,
        estimatedMaintenance: 300,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: 's4',
        title: `Cozy 2BR Townhouse in ${city || 'Quiet Community'}`,
        price: 195000,
        bedrooms: 2,
        bathrooms: 1.5,
        sqft: 1100,
        location: `${city || 'Quiet'} Community`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        yearBuilt: 2000,
        propertyType: 'Townhouse',
        estimatedMonthlyPayment: 1280,
        estimatedPropertyTax: 240,
        estimatedInsurance: 90,
        estimatedMaintenance: 120,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: 's5',
        title: `Luxury 5BR Estate in ${city || 'Upscale Area'}`,
        price: 650000,
        bedrooms: 5,
        bathrooms: 4,
        sqft: 3500,
        location: `${city || 'Upscale'} Neighborhood`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        yearBuilt: 2015,
        propertyType: 'Single Family',
        estimatedMonthlyPayment: 4280,
        estimatedPropertyTax: 850,
        estimatedInsurance: 300,
        estimatedMaintenance: 500,
        url: '#demo-property',
        isDemoData: true
      },
      {
        id: 's6',
        title: `Affordable 1BR Starter in ${city || 'First-Time Buyer Area'}`,
        price: 150000,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 800,
        location: `${city || 'First-Time Buyer'} Area`,
        city: city || 'Unknown',
        state: state || 'Unknown',
        yearBuilt: 1985,
        propertyType: 'Condo',
        estimatedMonthlyPayment: 990,
        estimatedPropertyTax: 190,
        estimatedInsurance: 70,
        estimatedMaintenance: 100,
        url: '#demo-property',
        isDemoData: true
      }
    ];
  }
};

// Mock rental properties dataset (default - will be replaced by location-based)
const MOCK_RENTAL_PROPERTIES = generatePropertiesForLocation('', '', 'rental');

// Mock properties for sale dataset (default - will be replaced by location-based)
const MOCK_SALE_PROPERTIES = generatePropertiesForLocation('', '', 'purchase');

export async function searchProperties(req: AuthRequest, res: Response) {
  try {
    const { searchType = 'rental', maxAmount, bedrooms, income, city, state, downPayment = 0 } = req.body;

    if (!income) {
      return res.status(400).json({ error: 'Annual income is required' });
    }

    if (searchType === 'rental' && !maxAmount) {
      return res.status(400).json({ error: 'Max rent is required for rental search' });
    }

    if (searchType === 'purchase' && !maxAmount) {
      return res.status(400).json({ error: 'Max price is required for home purchase search' });
    }

    // Generate location-based properties
    const propertiesDataset = searchType === 'rental' 
      ? generatePropertiesForLocation(city || '', state || '', 'rental')
      : generatePropertiesForLocation(city || '', state || '', 'purchase');

    let filteredProperties: any[] = [];
    let propertiesWithTrueCost: any[] = [];

    if (searchType === 'rental') {
      // Rental search logic
      const maxRentWithBuffer = maxAmount * 1.2;
      filteredProperties = (propertiesDataset as any[]).filter((p: any) => p.rent <= maxRentWithBuffer);
      
      if (filteredProperties.length === 0) {
        filteredProperties = [...(propertiesDataset as any[])].sort((a: any, b: any) => a.rent - b.rent);
      }
      
      if (bedrooms) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedrooms);
      }

      // Calculate true cost for rentals
      propertiesWithTrueCost = filteredProperties.map((p: any) => ({
        ...p,
        trueMonthlyCost: p.rent + p.estimatedUtilities + (p.commuteMinutes > 20 ? 100 : 0),
        rentBurdenPercentage: ((p.rent + p.estimatedUtilities) * 12 / income) * 100,
        exceedsBudget: p.rent > maxAmount
      }));

      // Sort by best value
      propertiesWithTrueCost.sort((a, b) => {
        const scoreA = a.rentBurdenPercentage * 0.7 - a.landlordRating * 10;
        const scoreB = b.rentBurdenPercentage * 0.7 - b.landlordRating * 10;
        return scoreA - scoreB;
      });
    } else {
      // Home purchase search logic
      const maxPriceWithBuffer = maxAmount * 1.15; // 15% buffer for homes
      filteredProperties = (propertiesDataset as any[]).filter((p: any) => p.price <= maxPriceWithBuffer);
      
      if (filteredProperties.length === 0) {
        filteredProperties = [...(propertiesDataset as any[])].sort((a: any, b: any) => a.price - b.price);
      }
      
      if (bedrooms) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedrooms);
      }

      // Calculate affordability for home purchases
      // Use provided down payment or default to 20%
      const interestRate = 0.06;
      const loanTermYears = 30;
      const monthlyInterestRate = interestRate / 12;
      const numPayments = loanTermYears * 12;

      propertiesWithTrueCost = filteredProperties.map((p: any) => {
        const actualDownPayment = downPayment > 0 ? downPayment : p.price * 0.20;
        const loanAmount = p.price - actualDownPayment;
        const monthlyPrincipalInterest = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments)) / (Math.pow(1 + monthlyInterestRate, numPayments) - 1);
        const totalMonthlyCost = monthlyPrincipalInterest + p.estimatedPropertyTax + p.estimatedInsurance + p.estimatedMaintenance;
        const monthlyIncome = income / 12;
        const affordabilityPercentage = (totalMonthlyCost / monthlyIncome) * 100;

        return {
          ...p,
          downPayment: actualDownPayment,
          loanAmount,
          monthlyPrincipalInterest: Math.round(monthlyPrincipalInterest),
          totalMonthlyCost: Math.round(totalMonthlyCost),
          affordabilityPercentage: parseFloat(affordabilityPercentage.toFixed(1)),
          exceedsBudget: p.price > maxAmount
        };
      });

      // Sort by affordability
      propertiesWithTrueCost.sort((a, b) => {
        const scoreA = a.affordabilityPercentage * 0.8 - (a.price / 10000); // Lower burden and lower price = better
        const scoreB = b.affordabilityPercentage * 0.8 - (b.price / 10000);
        return scoreA - scoreB;
      });
    }

    // Get AI analysis
    const topListings = propertiesWithTrueCost.slice(0, 3);
    const avoidListings = searchType === 'rental' 
      ? propertiesWithTrueCost.filter(p => 
          p.rentBurdenPercentage > 35 || p.landlordRating < 3.8
        ).slice(0, 2)
      : propertiesWithTrueCost.filter(p => 
          p.affordabilityPercentage > 40 || p.price > maxAmount * 1.1
        ).slice(0, 2);

    const locationContext = city && state ? ` in ${city}, ${state}` : city ? ` in ${city}` : state ? ` in ${state}` : '';
    const hasOverBudget = propertiesWithTrueCost.some(p => p.exceedsBudget);
    const searchTypeLabel = searchType === 'rental' ? 'Rental' : 'Home Purchase';
    let aiAnalysis = `**${searchTypeLabel} Property Search Analysis${locationContext ? ` for ${locationContext}` : ''} (Demo Data)**\n\n`;
    
    if (hasOverBudget && topListings.length > 0) {
      const budgetLabel = searchType === 'rental' ? `$${maxAmount}/month` : `$${maxAmount.toLocaleString()}`;
      aiAnalysis += `⚠️ **Note:** Some properties shown exceed your stated budget of ${budgetLabel}. These are included to show available options, but may require budget adjustments.\n\n`;
    }
    
    if (topListings.length > 0) {
      const topPick = topListings[0];
      
      if (searchType === 'rental') {
        aiAnalysis += `**Best Match: ${topPick.title}**\n`;
        aiAnalysis += `✅ At $${topPick.trueMonthlyCost}/month true cost, this represents ${topPick.rentBurdenPercentage.toFixed(1)}% of your income.\n\n`;
        
        if (topPick.rentBurdenPercentage < 30) {
          aiAnalysis += `This is an excellent choice - well within the 30% guideline. You'll have good financial flexibility.`;
        } else if (topPick.rentBurdenPercentage < 40) {
          aiAnalysis += `This is manageable but slightly elevated. Consider negotiating or looking for a roommate.`;
        } else {
          aiAnalysis += `⚠️ This may strain your budget. I recommend continuing your search or increasing income.`;
        }
      } else {
        aiAnalysis += `**Best Match: ${topPick.title}**\n`;
        aiAnalysis += `✅ At $${topPick.price.toLocaleString()} with $${topPick.downPayment.toLocaleString()} down payment, monthly cost is $${topPick.totalMonthlyCost}/month (${topPick.affordabilityPercentage.toFixed(1)}% of income).\n\n`;
        
        if (topPick.affordabilityPercentage < 28) {
          aiAnalysis += `Excellent affordability - well within recommended guidelines. This home fits comfortably in your budget.`;
        } else if (topPick.affordabilityPercentage < 35) {
          aiAnalysis += `Good affordability. Make sure you have emergency savings and can handle maintenance costs.`;
        } else {
          aiAnalysis += `⚠️ This may stretch your budget. Consider a lower-priced home or increasing your down payment.`;
        }
      }
      
      aiAnalysis += `\n\n**General Tips:**\n`;
      if (searchType === 'rental') {
        aiAnalysis += `• Always visit properties in person before signing\n`;
        aiAnalysis += `• Research the landlord's reputation\n`;
        aiAnalysis += `• Get everything in writing\n`;
        aiAnalysis += `• Calculate true cost including utilities and commute`;
      } else {
        aiAnalysis += `• Get pre-approved for a mortgage before making offers\n`;
        aiAnalysis += `• Factor in closing costs (2-5% of home price)\n`;
        aiAnalysis += `• Budget for maintenance (1% of home value annually)\n`;
        aiAnalysis += `• Consider property taxes and insurance in your monthly budget`;
      }
      if (locationContext) {
        aiAnalysis += `\n• Research local market rates in ${locationContext} to ensure you're getting a fair price`;
      }
    } else {
      const budgetLabel = searchType === 'rental' ? 'max rent' : 'max price';
      aiAnalysis += `No properties found in your budget range${locationContext ? ` ${locationContext}` : ''}. Try increasing your ${budgetLabel} or expanding your search area.`;
    }
    
    aiAnalysis += `\n\n*Note: These are demo properties for illustration. For AI-powered analysis of real listings${locationContext ? ` in ${locationContext}` : ''}, configure the Gemini API key.*`;
    
    try {
      const locationInfo = locationContext ? `Searching in ${locationContext}. ` : '';
      const prompt = searchType === 'rental'
        ? `Analyze these ${topListings.length} rental properties for someone earning $${income}/year${locationContext ? ` searching in ${locationContext}` : ''}:

TOP MATCHES:
${topListings.map((p, i) => `${i + 1}. ${p.title} - $${p.rent}/mo + $${p.estimatedUtilities} utilities = $${p.trueMonthlyCost} true cost (${p.rentBurdenPercentage.toFixed(1)}% of income)`).join('\n')}

${avoidListings.length > 0 ? `AVOID LIST:\n${avoidListings.map(p => `- ${p.title} (${p.rentBurdenPercentage.toFixed(1)}% burden, ${p.landlordRating}/5 rating)`).join('\n')}` : ''}

${locationInfo}Provide:
1. Why the #1 pick is best
2. Any red flags to watch for
3. Negotiation tip${locationContext ? `\n4. Local market insights for ${locationContext}` : ''}

Keep it under 200 words, practical and actionable.`
        : `Analyze these ${topListings.length} homes for sale for someone earning $${income}/year${locationContext ? ` searching in ${locationContext}` : ''}:

TOP MATCHES:
${topListings.map((p, i) => `${i + 1}. ${p.title} - $${p.price.toLocaleString()} (${p.bedrooms}BR/${p.bathrooms}BA, ${p.sqft} sqft) - $${p.totalMonthlyCost}/mo total (${p.affordabilityPercentage.toFixed(1)}% of income, $${p.downPayment.toLocaleString()} down)`).join('\n')}

${avoidListings.length > 0 ? `AVOID LIST:\n${avoidListings.map(p => `- ${p.title} (${p.affordabilityPercentage.toFixed(1)}% burden, $${p.price.toLocaleString()})`).join('\n')}` : ''}

${locationInfo}Provide:
1. Why the #1 pick is best
2. Any red flags to watch for
3. Homebuying tip${locationContext ? `\n4. Local market insights for ${locationContext}` : ''}

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
