import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { renterApi } from '../../lib/renterApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { formatCurrency } from '../../lib/utils';
import { 
  Calculator, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ArrowRight,
  Share2,
  Wallet,
  Home
} from 'lucide-react';

export default function RentCalculatorPage() {
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Real-time calculation logic for visual preview
  const previewBurden = income && rent ? (parseFloat(rent) * 12 / parseFloat(income)) * 100 : 0;
  const getStatusColor = (pct: number) => {
    if (pct < 30) return '#10B981'; // Green
    if (pct < 40) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!income || !rent) return;
    
    setError('');
    setIsLoading(true);

    try {
      const data = await renterApi.calculateRent({
        annualIncome: parseFloat(income),
        monthlyRent: parseFloat(rent),
        locationCity: city,
        locationState: state
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate burden');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Your Rent', value: parseFloat(rent), fill: getStatusColor(parseFloat(result.burdenPercentage)) },
    { name: 'Recommended (30%)', value: result.recommendedRent, fill: '#3B82F6' },
  ] : [];

  const pieData = result ? [
    { name: 'Rent', value: parseFloat(result.burdenPercentage) },
    { name: 'Remaining', value: 100 - parseFloat(result.burdenPercentage) },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4"
              >
                <Calculator className="h-4 w-4" />
                <span>Affordability Tool</span>
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Rent Burden Calculator
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                Analyze your housing costs against the "30% Rule" and get professional financial insights powered by Gemini AI.
              </p>
            </div>
            {result && (
              <Button variant="outline" className="gap-2 self-start md:self-center">
                <Share2 className="h-4 w-4" />
                Share Results
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-xl">Financial Details</CardTitle>
                <CardDescription>Enter your income and current housing costs</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleCalculate} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-sm font-semibold">Annual Gross Income</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          id="income"
                          type="number"
                          placeholder="60000"
                          className="pl-7 h-12 text-lg"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rent" className="text-sm font-semibold">Monthly Rent</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          id="rent"
                          type="number"
                          placeholder="1500"
                          className="pl-7 h-12 text-lg"
                          value={rent}
                          onChange={(e) => setRent(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                        <Input
                          id="city"
                          placeholder="e.g. Austin"
                          className="h-10"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                        <Input
                          id="state"
                          placeholder="e.g. TX"
                          className="h-10"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-xl"
                    disabled={isLoading || !income || !rent}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-bold leading-normal">
                        Analyze Affordability <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Simple Stats Card (Preview) */}
            {!result && income && rent && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">Live Preview</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider">Unsaved</span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {previewBurden.toFixed(1)}% <span className="text-sm font-normal text-slate-500">Rent-to-Income</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min(previewBurden, 100)}%`,
                      backgroundColor: getStatusColor(previewBurden)
                    }} 
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
                >
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-full shadow-lg mb-6">
                    <Home className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ready to analyze</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Fill in your financial details and we'll generate a comprehensive affordability report.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* High Level Score Card */}
                  <div className={`p-8 rounded-3xl border relative overflow-hidden shadow-xl ${result.isHealthy ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30' : 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Calculated Rent Burden</h3>
                        <div className="flex items-baseline gap-3">
                          <span className={`text-6xl font-black ${result.isHealthy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {result.burdenPercentage}%
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          {result.isHealthy ? (
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-bold">
                              <CheckCircle2 className="h-5 w-5" /> Healthy Affordability
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold">
                              <AlertCircle className="h-5 w-5" /> High Rent Burden
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            >
                              <Cell fill={getStatusColor(parseFloat(result.burdenPercentage))} />
                              <Cell fill="rgba(0,0,0,0.05)" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Comparisons & Saving */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-md overflow-hidden">
                      <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-blue-500" /> Comparison Chart
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-64 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical" margin={{ left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md bg-blue-600 text-white border-0 overflow-hidden relative">
                      <div className="absolute -right-10 -top-10 bg-white/10 w-32 h-32 rounded-full blur-3xl" />
                      <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Wallet className="h-4 w-4" /> Potential Savings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.isHealthy ? (
                          <div className="flex flex-col h-full justify-center">
                            <p className="text-blue-100 text-sm mb-4">You are already meeting the 30% guideline. Excellent work!</p>
                            <div className="text-3xl font-black">$0 saved</div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Monthly Overpayment</div>
                              <div className="text-3xl font-black">{formatCurrency(result.monthlyOverpayment)}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Annual Savings Potential</div>
                                <div className="text-4xl font-black bg-white/20 inline-block px-4 py-2 rounded-2xl">
                                  {formatCurrency(result.annualOverpayment)}
                                </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Analysis */}
                  <Card className="shadow-lg border-2 border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-900">
                    <CardHeader className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600 rounded-lg p-1.5">
                          <Info className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Gemini AI Analysis</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {result.aiAnalysis?.includes('unavailable') || result.aiAnalysis?.includes('API key') ? (
                        <div className="space-y-3">
                          <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                            <AlertDescription className="text-amber-900 dark:text-amber-200">
                              {result.aiAnalysis}
                            </AlertDescription>
                          </Alert>
                          <p className="text-slate-900 dark:text-slate-100 leading-relaxed text-base">
                            <strong>Based on your {result.burdenPercentage}% rent burden:</strong><br /><br />
                            {parseFloat(result.burdenPercentage) < 30 
                              ? "You're doing great! Your rent is well within the recommended 30% guideline. This leaves you with financial flexibility for savings, emergencies, and quality of life improvements."
                              : parseFloat(result.burdenPercentage) < 40
                              ? "Your rent burden is slightly elevated. Consider looking for ways to increase income or find more affordable housing options. Even reducing rent by $200-300/month could significantly improve your financial health."
                              : "Your rent burden is critically high. This puts you at risk of housing instability. Prioritize finding more affordable housing, increasing income through side work, or applying for rental assistance programs in your area."}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-900 dark:text-slate-100 leading-relaxed text-base whitespace-pre-line">
                          {result.aiAnalysis}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
