import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import apiClient from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { formatCurrency } from '../../lib/utils';
import { useUserStore } from '../../stores/userStore';
import { US_STATES } from '../../lib/constants';
import {
  Search,
  MapPin,
  DollarSign,
  Home,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Star,
  Info,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';
import { useNavigate } from 'react-router-dom';

export default function PropertySearchPage() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [searchType, setSearchType] = useState<'rental' | 'purchase'>('rental');
  const [income, setIncome] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      if (!income && profile.annualIncome) {
        setIncome(profile.annualIncome.toString());
      }
      if (!city && profile.locationCity) {
        setCity(profile.locationCity);
      }
      if (!state && profile.locationState) {
        setState(profile.locationState);
      }
      // Set search type based on current mode
      if (profile.currentMode === 'buyer') {
        setSearchType('purchase');
      }
    }
  }, [profile]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!income) return;
    if (searchType === 'rental' && !maxRent) return;
    if (searchType === 'purchase' && !maxPrice) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/property/search', {
        searchType: searchType,
        income: parseFloat(income),
        maxAmount: searchType === 'rental' ? parseFloat(maxRent) : parseFloat(maxPrice),
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        city: city || undefined,
        state: state || undefined
      });
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search properties');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <AppHeader />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8">
      
        <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-slate-600  dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
            <Search className="h-4 w-4" />
            <span>AI-Powered Search</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            AI Property Search
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            {searchType === 'rental' 
              ? 'Find rental properties that fit your budget with true cost analysis powered by Gemini AI.'
              : 'Find homes for sale with affordability analysis and AI-powered recommendations.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-4">
            <Card className="shadow-lg border-0 sticky top-8 !bg-blue-900">
              <CardHeader>
                <CardTitle className="text-slate-300 dark:text-white">Search Criteria</CardTitle>
                <CardDescription className='text-slate-100'>Enter your budget and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="searchType" className="text-slate-300 dark:text-white">Search Type</Label>
                    <Select value={searchType} onValueChange={(value: 'rental' | 'purchase') => setSearchType(value)}>
                      <SelectTrigger className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rental">Rentals</SelectItem>
                        <SelectItem value="purchase">Homes for Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income" className="text-slate-300 dark:text-white">Annual Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="income"
                        type="number"
                        className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="60000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {searchType === 'rental' ? (
                    <div className="space-y-2">
                      <Label htmlFor="maxRent" className="text-slate-300 dark:text-white">Max Monthly Rent</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="maxRent"
                          type="number"
                          className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder="1800"
                          value={maxRent}
                          onChange={(e) => setMaxRent(e.target.value)}
                          required={searchType === 'rental'}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="maxPrice" className="text-slate-300 dark:text-white">Max Home Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="maxPrice"
                          type="number"
                          className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder="300000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          required={searchType === 'purchase'}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-slate-300 dark:text-white">Minimum Bedrooms (Optional)</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="bedrooms"
                        type="number"
                        className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="2"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-300 dark:text-white">City (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="city"
                        type="text"
                        className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-300 dark:text-white">State (Optional)</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {US_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-5 w-5" /> Find Properties
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-8">
            {!results ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <MapPin className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-400 dark:text-slate-600 mb-2">Ready to search</h3>
                <p className="text-slate-400 dark:text-slate-600 max-w-sm">
                  Fill in your search criteria and we'll find the best properties for your budget.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary */}
                <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Search Results</div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{results.totalFound} Properties Found</div>
                      </div>
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                {/* Top Picks */}
                {results.topPicks.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" /> Top Matches
                    </h2>
                    <div className="space-y-4">
                      {results.topPicks.map((property: any, idx: number) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card className="border-0 shadow-md hover:shadow-xl transition-all bg-white dark:bg-slate-900">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{property.title}</h3>
                                    {property.exceedsBudget && (
                                      <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                        Over Budget
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <MapPin className="h-3 w-3" />
                                    <span>{property.location}</span>
                                    <span>•</span>
                                    <span>{property.bedrooms}BR / {property.bathrooms}BA</span>
                                    {property.sqft && <span>• {property.sqft.toLocaleString()} sqft</span>}
                                    {property.propertyType && <span>• {property.propertyType}</span>}
                                  </div>
                                </div>
                                {property.landlordRating && (
                                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{property.landlordRating}</span>
                                  </div>
                                )}
                              </div>

                              {searchType === 'rental' ? (
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Base Rent</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(property.rent)}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">True Cost</div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(property.trueMonthlyCost)}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Burden</div>
                                    <div className={`text-lg font-bold ${property.rentBurdenPercentage < 30 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                      {property.rentBurdenPercentage.toFixed(1)}%
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(property.price)}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Down Payment</div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(property.downPayment)}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Cost</div>
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(property.totalMonthlyCost)}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Affordability</div>
                                    <div className={`text-lg font-bold ${property.affordabilityPercentage < 28 ? 'text-green-600 dark:text-green-400' : property.affordabilityPercentage < 35 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {property.affordabilityPercentage.toFixed(1)}%
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/30">
                              <p className="text-xs text-amber-700 dark:text-amber-400">
                                📊 Demo Property - Calculations are accurate, listing is for illustration
                                {searchType === 'purchase' && property.yearBuilt && ` • Built in ${property.yearBuilt}`}
                              </p>
                            </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avoid List */}
                {results.avoidList.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <XCircle className="h-6 w-6 text-red-600" /> Properties to Avoid
                    </h2>
                    <div className="space-y-3">
                      {results.avoidList.map((property: any) => (
                        <Card key={property.id} className="border-0 bg-red-50/50 dark:bg-red-950/10">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{property.title}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {property.location} • {searchType === 'rental' ? `${formatCurrency(property.rent)}/mo` : formatCurrency(property.price)}
                                </div>
                              </div>
                              <div className="text-sm font-bold text-red-600 dark:text-red-400">
                                {searchType === 'rental' 
                                  ? `${property.rentBurdenPercentage.toFixed(1)}% burden`
                                  : `${property.affordabilityPercentage.toFixed(1)}% of income`}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Analysis */}
                <Card className="border-2 border-blue-100 dark:border-blue-900/30 shadow-lg bg-white dark:bg-slate-900">
                  <CardHeader className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 rounded-lg p-1.5">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Gemini AI Recommendations</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 text-white">
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-slate-900 dark:prose-p:text-slate-100 prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:text-slate-900 dark:prose-li:text-slate-100">
                      <ReactMarkdown>{results.aiAnalysis}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
