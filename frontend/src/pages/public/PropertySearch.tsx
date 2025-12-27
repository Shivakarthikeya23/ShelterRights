import { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { formatCurrency } from '../../lib/utils';
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
  XCircle
} from 'lucide-react';

export default function PropertySearchPage() {
  const [income, setIncome] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!income || !maxRent) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/property/search', {
        income: parseFloat(income),
        maxRent: parseFloat(maxRent),
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined
      });
      setResults(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search properties');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
            <Search className="h-4 w-4" />
            <span>AI-Powered Search</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Property Search
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Find apartments that fit your budget with true cost analysis powered by Gemini AI.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-4">
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Search Criteria</CardTitle>
                <CardDescription>Enter your budget and preferences</CardDescription>
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
                    <Label htmlFor="income" className="text-slate-900 dark:text-white">Annual Income</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="maxRent" className="text-slate-900 dark:text-white">Max Monthly Rent</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="maxRent"
                        type="number"
                        className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="1800"
                        value={maxRent}
                        onChange={(e) => setMaxRent(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-slate-900 dark:text-white">Minimum Bedrooms (Optional)</Label>
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
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{property.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <MapPin className="h-3 w-3" />
                                    <span>{property.location}</span>
                                    <span>•</span>
                                    <span>{property.bedrooms}BR / {property.bathrooms}BA</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20">
                                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{property.landlordRating}</span>
                                </div>
                              </div>

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

                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <a href={property.url} target="_blank" rel="noopener noreferrer">
                                  View Listing <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                              </Button>
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
                                <div className="text-sm text-slate-600 dark:text-slate-400">{property.location} • {formatCurrency(property.rent)}/mo</div>
                              </div>
                              <div className="text-sm font-bold text-red-600 dark:text-red-400">
                                {property.rentBurdenPercentage.toFixed(1)}% burden
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
                  <CardContent className="pt-6">
                    <p className="text-slate-900 dark:text-slate-100 leading-relaxed text-base whitespace-pre-line">
                      {results.aiAnalysis}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
