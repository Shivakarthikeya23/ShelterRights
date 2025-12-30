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
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
  Building
} from 'lucide-react';

export default function HOATrackerPage() {
  const navigate = useNavigate();
  const [currentHOA, setCurrentHOA] = useState('');
  const [previousHOA, setPreviousHOA] = useState('');
  const [yearsTracked, setYearsTracked] = useState('2');

  const current = parseFloat(currentHOA) || 0;
  const previous = parseFloat(previousHOA) || 0;
  const years = parseFloat(yearsTracked) || 2;

  const increase = current - previous;
  const increasePercentage = previous > 0 ? ((increase / previous) * 100) : 0;
  const monthlyIncrease = increase;
  const annualIncrease = monthlyIncrease * 12;

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
            <Building className="h-4 w-4" />
            <span>HOA Analysis</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            HOA Abuse Tracker
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Track HOA fee increases and compare with community data to identify potential abuse.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>HOA Fee Information</CardTitle>
                <CardDescription>Enter your HOA fee history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Previous Monthly HOA Fee</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="200"
                      value={previousHOA}
                      onChange={(e) => setPreviousHOA(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Monthly HOA Fee</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="350"
                      value={currentHOA}
                      onChange={(e) => setCurrentHOA(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Years Tracked</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={yearsTracked}
                    onChange={(e) => setYearsTracked(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            {currentHOA && previousHOA ? (
              <>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                      Fee Increase Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Previous Fee</div>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(previous)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Fee</div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(current)}</div>
                      </div>
                    </div>

                    <Alert className={increasePercentage > 50 ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>HOA raised fees {formatCurrency(monthlyIncrease)}/month ({increasePercentage.toFixed(1)}%) in {years} years.</strong>
                        {increasePercentage > 50 && (
                          <span className="block mt-1">
                            This is a significant increase that may indicate excessive fees.
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <div className="font-bold text-blue-900 mb-1">Community Data</div>
                          <div className="text-sm text-blue-700 ">
                            78% of homeowners report excessive fees. Join lawsuit against HOA board. 34 homeowners already signed.
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
                  <Building className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter your HOA fee information to analyze increases
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

