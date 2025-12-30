import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '@/components/layout/AppHeader';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { 
  Calculator, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Share2,
  Wallet,
  Home,
  ChevronRight,
  Info,
  ArrowLeft
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BuyCalculatorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');
  const [debts, setDebts] = useState('');
  const [creditScore, setCreditScore] = useState(700);
  
  // Logic
  const monthlyGross = parseFloat(income) / 12 || 0;
  const bankApproval = monthlyGross * 0.43 - (parseFloat(debts) || 0); // 43% DTI Rule
  const realisticAffordable = monthlyGross * 0.28; // 28% Rule for Front-End Ratio
  
  const downPayment = parseFloat(savings) || 0;
  
  // Estimates
  const estimatedHousePrice = (bankApproval * 150) + downPayment; 
  const realisticHousePrice = (realisticAffordable * 150) + downPayment;

  const chartData = [
    { name: 'Bank Approves', value: Math.round(bankApproval), fill: '#EF4444' },
    { name: 'Realistic Budget', value: Math.round(realisticAffordable), fill: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader />
      <div className="pb-20">
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
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                <Home className="h-4 w-4" />
                <span>Homebuyer Tool</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Buying Power Calculator
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                Discover your true buying power. We compare what the bank says you can afford vs. what is actually sustainable for your lifestyle.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-800'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Multi-step Form */}
          <div className="lg:col-span-5">
            <Card className="shadow-xl border-0 overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 space-y-6"
                  >
                    <div className="space-y-2">
                      <CardTitle>Income & Savings</CardTitle>
                      <CardDescription>Let's start with your available resources</CardDescription>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Annual Gross Income</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <Input 
                            type="number" 
                            className="pl-7 h-12" 
                            placeholder="85000" 
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Total Savings for Down Payment</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <Input 
                            type="number" 
                            className="pl-7 h-12" 
                            placeholder="20000" 
                            value={savings}
                            onChange={(e) => setSavings(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700" onClick={() => setStep(2)}>
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 space-y-6"
                  >
                    <div className="space-y-2">
                      <CardTitle>Debts & Credit</CardTitle>
                      <CardDescription>Monthly obligations affect your buying power</CardDescription>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Monthly Debt Payments (Car, Student Loans, etc.)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <Input 
                            type="number" 
                            className="pl-7 h-12" 
                            placeholder="400" 
                            value={debts}
                            onChange={(e) => setDebts(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Estimated Credit Score: {creditScore}</Label>
                        </div>
                        <input 
                          type="range" 
                          min="300" 
                          max="850" 
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                          value={creditScore}
                          onChange={(e) => setCreditScore(parseInt(e.target.value))}
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                          <span>Poor</span>
                          <span>Fair</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>Back</Button>
                      <Button className="flex-1 h-12 bg-purple-600 hover:bg-purple-700" onClick={() => setStep(3)}>Generate Analysis</Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                   <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 space-y-6"
                   >
                     <div className="flex items-center justify-between">
                       <CardTitle>Calculations Ready</CardTitle>
                       <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Reset</Button>
                     </div>
                     
                     <div className="space-y-4">
                       <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
                         <div className="text-xs font-bold text-green-600 uppercase mb-1">Realistic Purchase Price</div>
                         <div className="text-3xl font-black text-green-700 dark:text-green-400">{formatCurrency(realisticHousePrice)}</div>
                       </div>

                       <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                         <div className="text-xs font-bold text-slate-500 uppercase mb-1">Max Bank Approval</div>
                         <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{formatCurrency(estimatedHousePrice)}</div>
                         <p className="text-[10px] text-slate-400 mt-2 italic">Based on standard 43% Debt-to-Income limit</p>
                       </div>
                     </div>

                     <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 font-bold">
                       View Amortization Schedule
                     </Button>
                   </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex gap-3 text-sm text-blue-800 dark:text-blue-300"
            >
              <Info className="h-5 w-5 shrink-0" />
              <p>The "Realistic Budget" uses the 28/36 rule, ensuring your home doesn't prevent you from saving for retirement or emergencies.</p>
            </motion.div>
          </div>

          {/* Visualization / Output */}
          <div className="lg:col-span-7 space-y-6">
            {!income ? (
               <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Calculator className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-400">Analysis Preview</h3>
                <p className="text-slate-400 max-w-sm">Enter your financial information to see your homebuying potential visualized here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Housing Budget Comparison</CardTitle>
                    <CardDescription>Bank Max vs. Sustainable Budget</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis tickFormatter={(val) => `$${val}`} fontSize={12} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(val) => [formatCurrency(val as number), 'Monthly Amount']}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-900 text-white border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10"><Wallet className="w-24 h-24" /></div>
                    <CardHeader>
                      <CardTitle className="text-sm">Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Mortgage P&I</span>
                        <span className="font-bold">{formatCurrency(realisticAffordable * 0.7)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Taxes & Ins.</span>
                        <span className="font-bold">{formatCurrency(realisticAffordable * 0.2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Maintenance</span>
                        <span className="font-bold">{formatCurrency(realisticAffordable * 0.1)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-600 to-blue-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-sm">Buy Signal</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-center py-4">
                      <div className="text-4xl font-black mb-2">READY</div>
                      <p className="text-xs text-purple-100">Based on your savings and credit score, you are in a strong position to begin house hunting.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
