import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '../../components/layout/AppHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { formatCurrency } from '../../lib/utils';
import { 
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Home,
  Calendar
} from 'lucide-react';

export default function PropertyTaxPage() {
  const navigate = useNavigate();
  const [homeValue, setHomeValue] = useState('');
  const [currentTax, setCurrentTax] = useState('');
  const [yearsOwned, setYearsOwned] = useState('3');
  const [taxIncreaseRate, setTaxIncreaseRate] = useState('6');

  const homeVal = parseFloat(homeValue) || 0;
  const tax = parseFloat(currentTax) || 0;
  const years = parseFloat(yearsOwned) || 3;
  const increaseRate = parseFloat(taxIncreaseRate) || 6;

  // Calculate projected tax burden
  const projectedTax = tax * Math.pow(1 + increaseRate / 100, years);
  const totalIncrease = projectedTax - tax;
  const increasePercentage = ((projectedTax - tax) / tax) * 100;
  
  // Calculate years until unaffordable (assuming 30% of income rule)
  const monthlyTax = projectedTax / 12;
  const affordableIncome = monthlyTax * 12 / 0.30; // 30% rule
  const yearsUntilUnaffordable = years + (affordableIncome > 0 ? Math.log(affordableIncome / (tax * 12 / 0.30)) / Math.log(1 + increaseRate / 100) : 10);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <AppHeader />
      
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-4">
            <DollarSign className="h-4 w-4" />
            <span>Property Tax Analysis</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Property Tax Burden Check
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Analyze your property tax burden and project future increases to understand long-term affordability.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>Enter your property details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Home Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="285000"
                      value={homeValue}
                      onChange={(e) => setHomeValue(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Annual Property Tax</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="6800"
                      value={currentTax}
                      onChange={(e) => setCurrentTax(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Years Owned</Label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={yearsOwned}
                    onChange={(e) => setYearsOwned(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Annual Tax Increase Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="6"
                    step="0.1"
                    value={taxIncreaseRate}
                    onChange={(e) => setTaxIncreaseRate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            {homeValue && currentTax ? (
              <>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                      Tax Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Tax</div>
                        <div className="text-2xl font-bold text-slate-900 ">{formatCurrency(tax)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Projected Tax ({years} years)</div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(projectedTax)}</div>
                      </div>
                    </div>

                    <Alert className={increasePercentage > 15 ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Taxes increased {increasePercentage.toFixed(1)}% in {years} years.</strong>
                        {increasePercentage > 15 && (
                          <span className="block mt-1">
                            At this rate, taxes may become unaffordable in approximately {Math.round(yearsUntilUnaffordable)} years.
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <div className="font-bold text-blue-900 mb-1">Property Tax Relief Available</div>
                          <div className="text-sm text-blue-700">
                            Property tax relief petition active. Join 847 homeowners fighting this increase.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Home className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter your property information to see tax projections
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

