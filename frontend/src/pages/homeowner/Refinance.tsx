import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { formatCurrency } from '../../lib/utils';
import { 
  ArrowLeft,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Calculator,
  AlertCircle
} from 'lucide-react';

export default function RefinancePage() {
  const navigate = useNavigate();
  const [currentPayment, setCurrentPayment] = useState('1950');
  const [currentRate, setCurrentRate] = useState('7.5');
  const [newRate, setNewRate] = useState('6.2');
  const [purchaseYear, setPurchaseYear] = useState('2021');

  const currentPay = parseFloat(currentPayment) || 0;
  const currRate = parseFloat(currentRate) || 0;
  const newRateVal = parseFloat(newRate) || 0;

  // Calculate savings
  const monthlySavings = currentPay - (currentPay * (newRateVal / currRate));
  const annualSavings = monthlySavings * 12;
  const savingsOver5Years = annualSavings * 5;

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
            <Calculator className="h-4 w-4" />
            <span>Refinance Analysis</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Refinance Analyzer
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Determine if refinancing your mortgage makes financial sense based on current rates and your situation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Current Mortgage</CardTitle>
                <CardDescription>Enter your current mortgage details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Monthly Payment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="1950"
                      value={currentPayment}
                      onChange={(e) => setCurrentPayment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Interest Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="7.5"
                    step="0.1"
                    value={currentRate}
                    onChange={(e) => setCurrentRate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Purchase Year</Label>
                  <Input
                    type="number"
                    placeholder="2021"
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Interest Rate (%)</Label>
                  <Input
                    type="number"
                    placeholder="6.2"
                    step="0.1"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            {currentPayment && currentRate && newRate ? (
              <>
                <Card className="border-0 shadow-lg border-green-200 dark:border-green-900/30">
                  <CardHeader className="bg-green-50 dark:bg-green-950/20">
                    <CardTitle className="flex items-center gap-2 text-green-900 ">
                      <TrendingDown className="h-5 w-5" />
                      Refinance Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Payment</div>
                        <div className="text-2xl font-bold text-slate-900 ">{formatCurrency(currentPay)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">New Payment</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(currentPay * (newRateVal / currRate))}
                        </div>
                      </div>
                    </div>

                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <strong>${monthlySavings.toFixed(0)}/month = ${formatCurrency(annualSavings)}/year savings.</strong>
                        <span className="block mt-1">Refinance recommended!</span>
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="text-sm font-bold text-blue-900 mb-2">
                        5-Year Savings Projection
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(savingsOver5Years)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Calculator className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter your mortgage details to see refinance savings
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

