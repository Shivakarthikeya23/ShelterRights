import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  ArrowLeft,
  AlertCircle,
  Shield,
  Calendar,
  Phone,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function ForeclosurePage() {
  const navigate = useNavigate();
  const [missedPayments, setMissedPayments] = useState('2');
  const [currentPayment, setCurrentPayment] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const missed = parseInt(missedPayments) || 0;
  const daysUntilForeclosure = Math.max(0, 90 - (missed * 30));

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
            <Shield className="h-4 w-4" />
            <span>Foreclosure Prevention</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Foreclosure Prevention
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Get immediate help if you're falling behind on payments. We'll connect you with resources and assistance programs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Your Situation</CardTitle>
                <CardDescription>Help us understand your circumstances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Missed Payments</Label>
                  <Input
                    type="number"
                    placeholder="2"
                    value={missedPayments}
                    onChange={(e) => setMissedPayments(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Mortgage Payment</Label>
                  <Input
                    type="number"
                    placeholder="1950"
                    value={currentPayment}
                    onChange={(e) => setCurrentPayment(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Monthly Income</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6">
            {missedPayments ? (
              <>
                <Alert className="border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>You have {daysUntilForeclosure} days before foreclosure.</strong>
                    <span className="block mt-1">Here are 5 assistance programs that can help:</span>
                  </AlertDescription>
                </Alert>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Assistance Programs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 hover:text-white">
                    {[
                      { name: 'Free Legal Aid', description: 'Get free legal assistance for foreclosure prevention', link: 'https://www.lsc.gov/find-legal-aid' },
                      { name: 'Loan Modification Help', description: 'Work with your lender to modify your loan terms', link: 'https://www.consumerfinance.gov/ask-cfpb/' },
                      { name: 'HUD Counseling', description: 'Free HUD-approved housing counseling services', link: 'https://www.hud.gov/topics/avoiding_foreclosure' },
                      { name: 'State Assistance Programs', description: 'State-specific foreclosure prevention programs', link: '#' },
                      { name: 'Emergency Mortgage Assistance', description: 'Temporary assistance for qualified homeowners', link: '#' }
                    ].map((program, idx) => (
                      <div key={idx} className="p-4 border rounded-lg text-black dark:hover:bg-slate-900  hover:text-white transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 hover:text-white mb-1">{program.name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{program.description}</div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={program.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-blue-900 dark:text-blue-100 mb-2">Need Immediate Help?</div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Call the National Foreclosure Mitigation Counseling Program: <strong>1-888-995-HOPE</strong>
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Available 24/7 for free, confidential assistance
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <Shield className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Enter your information to see available assistance programs
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

