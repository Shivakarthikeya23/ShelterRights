import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { formatCurrency } from '../../lib/utils';
import { Home, TrendingUp, Calculator, Info, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';

export default function RentVsBuyPage() {
  const navigate = useNavigate();
  const [currentRent, setCurrentRent] = useState('1500');
  const [homePrice, setHomePrice] = useState('300000');
  const [downPayment, setDownPayment] = useState('60000');
  const [loanTerm, setLoanTerm] = useState('30');
  const [yearsPlanning, setYearsPlanning] = useState('10');
  
  // Assumptions (editable)
  const [rentIncrease, setRentIncrease] = useState(3);
  const [homeAppreciation, setHomeAppreciation] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [interestRate, setInterestRate] = useState(7);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [maintenanceRate, setMaintenanceRate] = useState(1);

  const rent = parseFloat(currentRent) || 0;
  const price = parseFloat(homePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const years = parseInt(yearsPlanning) || 10;
  
  // Calculate mortgage payment
  const loanAmount = price - down;
  const monthlyRate = (interestRate / 100) / 12;
  const numberOfPayments = parseInt(loanTerm) * 12;
  const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  // Calculate monthly costs for buying
  const monthlyPropertyTax = (price * (propertyTaxRate / 100)) / 12;
  const monthlyMaintenance = (price * (maintenanceRate / 100)) / 12;
  const monthlyInsurance = 100; // Simplified
  const totalMonthlyBuyCost = monthlyMortgage + monthlyPropertyTax + monthlyMaintenance + monthlyInsurance;

  // Generate year-by-year comparison data
  const generateChartData = () => {
    const data = [];
    let cumulativeRentCost = 0;
    let cumulativeBuyCost = down; // Start with down payment
    let currentRentAmount = rent;
    let currentHomeValue = price;

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        // Rent increases
        cumulativeRentCost += currentRentAmount * 12;
        currentRentAmount *= (1 + rentIncrease / 100);
        
        // Buy costs
        cumulativeBuyCost += totalMonthlyBuyCost * 12;
        
        // Home appreciates
        currentHomeValue *= (1 + homeAppreciation / 100);
      }

      data.push({
        year,
        rentCost: Math.round(cumulativeRentCost),
        buyCost: Math.round(cumulativeBuyCost),
        homeValue: Math.round(currentHomeValue),
        netWorthRent: Math.round(-cumulativeRentCost), // Negative because it's pure expense
        netWorthBuy: Math.round(currentHomeValue - cumulativeBuyCost)
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const finalYear = chartData[chartData.length - 1];
  
  // Find break-even point
  const breakEvenYear = chartData.find((d, i) => i > 0 && d.buyCost < d.rentCost)?.year || years;
  
  // Recommendation logic
  const getRecommendation = () => {
    if (breakEvenYear <= 3)
      return { text: "Buy Now", color: "text-green-600", advice: "Buying makes financial sense immediately." };
  
    if (breakEvenYear <= 5)
      return { text: "Buy Soon", color: "text-blue-600", advice: "Buying is better if you stay 5+ years." };
  
    if (breakEvenYear < years)
      return { text: "Consider Buying", color: "text-amber-600", advice: "Buying becomes advantageous later." };
  
    return {
      text: "Keep Renting",
      color: "text-slate-600",
      advice: "Buying never breaks even within your planning horizon."
    };
  };
  

  const recommendation = getRecommendation();

  return (
    <>
    <AppHeader />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            Financial Analysis
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Rent vs Buy Analyzer
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Compare the total cost of renting versus buying over time to make an informed decision.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Inputs */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-slate-900">Scenario Details</CardTitle>
                <CardDescription>Enter your current situation and targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-900">Current Monthly Rent</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      value={currentRent}
                      onChange={(e) => setCurrentRent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900">Target Home Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      value={homePrice}
                      onChange={(e) => setHomePrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900">Down Payment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9 h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                    />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {((down / price) * 100).toFixed(1)}% of home price
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-900">Loan Term (Years)</Label>
                    <Input
                      type="number"
                      className="h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-900">Planning Horizon</Label>
                    <Input
                      type="number"
                      className="h-11 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      value={yearsPlanning}
                      onChange={(e) => setYearsPlanning(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assumptions Panel */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-slate-900">
                  <Info className="h-4 w-4" /> Assumptions (Editable)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label className="text-slate-700">Annual Rent Increase</Label>
                    <span className="font-bold text-slate-900">{rentIncrease}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={rentIncrease}
                    onChange={(e) => setRentIncrease(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label className="text-slate-700">Home Appreciation</Label>
                    <span className="font-bold text-slate-900">{homeAppreciation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={homeAppreciation}
                    onChange={(e) => setHomeAppreciation(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label className="text-slate-700">Interest Rate</Label>
                    <span className="font-bold text-slate-900">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label className="text-slate-700">Property Tax Rate</Label>
                    <span className="font-bold text-slate-900">{propertyTaxRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recommendation Card */}
            <Card className={`border-2 shadow-xl bg-white dark:bg-slate-900`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recommendation</div>
                    <div className={`text-4xl font-black ${recommendation.color} mb-2`}>{recommendation.text}</div>
                    <p className="text-slate-600 dark:text-slate-300 max-w-md">{recommendation.advice}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Break-Even Point</div>
                    <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{breakEvenYear} Years</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison Chart */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Cumulative Cost Over Time</CardTitle>
                <CardDescription>Total out-of-pocket expenses for renting vs buying</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number) => formatCurrency(val)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="rentCost" stroke="#EF4444" strokeWidth={3} name="Rent Cost" dot={false} />
                    <Line type="monotone" dataKey="buyCost" stroke="#3B82F6" strokeWidth={3} name="Buy Cost" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Net Worth Projection */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Net Worth Impact</CardTitle>
                <CardDescription>How each decision affects your wealth over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number) => formatCurrency(val)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="netWorthRent" stroke="#EF4444" strokeWidth={3} name="Net Worth (Rent)" dot={false} />
                    <Line type="monotone" dataKey="netWorthBuy" stroke="#10B981" strokeWidth={3} name="Net Worth (Buy)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Final Numbers */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-md bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-900 dark:text-white">Total Cost of Renting ({years} years)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-red-600 dark:text-red-400">{formatCurrency(finalYear.rentCost)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">Pure expense with no equity built</div>
                </CardContent>
              </Card>

              <Card className="shadow-md bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="text-sm text-slate-900 dark:text-white">Total Cost of Buying ({years} years)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(finalYear.buyCost)}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Home worth {formatCurrency(finalYear.homeValue)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
