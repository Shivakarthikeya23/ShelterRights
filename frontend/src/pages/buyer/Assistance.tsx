import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { formatCurrency } from '../../lib/utils';
import {
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Award,
  Flag,
  Home,
  Shield,
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';

// Mock assistance programs database
const ASSISTANCE_PROGRAMS = [
  {
    id: 'fha',
    name: 'FHA Loan',
    type: 'Federal',
    downPaymentPercent: 3.5,
    maxAmount: 50000,
    eligibility: ['first-time', 'low-income'],
    description: 'Federal Housing Administration loan with low down payment requirement',
    requirements: ['Credit score 580+', 'Debt-to-income ratio <43%', 'Property must be primary residence'],
    applicationUrl: 'https://www.hud.gov/buying/loans'
  },
  {
    id: 'va',
    name: 'VA Loan',
    type: 'Federal',
    downPaymentPercent: 0,
    maxAmount: 100000,
    eligibility: ['veteran', 'military'],
    description: 'Zero down payment loan for eligible veterans and active military',
    requirements: ['Certificate of Eligibility (COE)', 'Qualifying military service', 'Meet lender credit/income standards'],
    applicationUrl: 'https://www.va.gov/housing-assistance/home-loans/'
  },
  {
    id: 'usda',
    name: 'USDA Rural Development Loan',
    type: 'Federal',
    downPaymentPercent: 0,
    maxAmount: 75000,
    eligibility: ['rural', 'low-income'],
    description: 'Zero down for rural and suburban homebuyers',
    requirements: ['Property in eligible rural area', 'Income at/below area median', 'US citizenship or permanent residency'],
    applicationUrl: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs'
  },
  {
    id: 'state-texas',
    name: 'Texas First Time Homebuyer Program',
    type: 'State',
    downPaymentPercent: 3,
    maxAmount: 15000,
    eligibility: ['first-time', 'texas'],
    description: 'Down payment assistance for first-time buyers in Texas',
    requirements: ['First-time homebuyer', 'Income limits apply', 'Complete homebuyer education course'],
    applicationUrl: 'https://www.tsahc.org/'
  },
  {
    id: 'state-california',
    name: 'CalHFA MyHome Assistance Program',
    type: 'State',
    downPaymentPercent: 3.5,
    maxAmount: 20000,
    eligibility: ['first-time', 'california'],
    description: 'California Housing Finance Agency assistance program',
    requirements: ['First-time homebuyer or not owned in 3 years', 'Income limits by county', 'CalHFA approved lender'],
    applicationUrl: 'https://www.calhfa.ca.gov/'
  },
  {
    id: 'employer',
    name: 'Employer-Sponsored Programs',
    type: 'Private',
    downPaymentPercent: 5,
    maxAmount: 25000,
    eligibility: ['employer'],
    description: 'Many employers offer homebuying assistance to employees',
    requirements: ['Employment tenure requirements vary', 'May require staying with company', 'Check with HR department'],
    applicationUrl: '#'
  },
  {
    id: 'native-american',
    name: 'Native American Direct Loan',
    type: 'Federal',
    downPaymentPercent: 0,
    maxAmount: 80000,
    eligibility: ['native-american'],
    description: 'HUD program for Native Americans on federal trust land',
    requirements: ['Native American or Alaska Native', 'Land must be in federal trust', 'Income limits apply'],
    applicationUrl: 'https://www.hud.gov/program_offices/public_indian_housing/ih/homeownership/184'
  }
];

export default function AssistancePage() {
  const navigate = useNavigate();
  const [income, setIncome] = useState('');
  const [homePrice, setHomePrice] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isVeteran, setIsVeteran] = useState(false);
  const [location, setLocation] = useState('');
  const [hasEmployerProgram, setHasEmployerProgram] = useState(false);
  
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  // Filter eligible programs
  const eligiblePrograms = ASSISTANCE_PROGRAMS.filter(program => {
    if (isVeteran && program.eligibility.includes('veteran')) return true;
    if (isVeteran && program.eligibility.includes('military')) return true;
    if (isFirstTime && program.eligibility.includes('first-time')) return true;
    if (hasEmployerProgram && program.eligibility.includes('employer')) return true;
    if (location.toLowerCase().includes('texas') && program.eligibility.includes('texas')) return true;
    if (location.toLowerCase().includes('california') && program.eligibility.includes('california')) return true;
    if (program.type === 'Federal' && !program.eligibility.includes('veteran') && !program.eligibility.includes('military')) return true;
    return false;
  });

  const price = parseFloat(homePrice) || 0;
  const totalAssistance = eligiblePrograms.reduce((sum, p) => sum + Math.min(p.maxAmount, price * (p.downPaymentPercent / 100)), 0);

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
            className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
            <Award className="h-4 w-4" />
            <span>Financial Assistance</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Down Payment Assistance Finder
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Discover programs that can help you afford your first home with reduced or zero down payment.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {!showResults ? (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Find Your Assistance</CardTitle>
                <CardDescription>Answer a few questions to see programs you qualify for</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-900">Annual Household Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        className="pl-9 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="65000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-900">Target Home Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        className="pl-9 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="250000"
                        value={homePrice}
                        onChange={(e) => setHomePrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-900">Location (City or State)</Label>
                    <Input
                      type="text"
                      className="h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="e.g., Austin, Texas"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-900">Eligibility (Check all that apply)</Label>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="firstTime"
                        checked={isFirstTime}
                        onCheckedChange={(checked) => setIsFirstTime(checked as boolean)}
                      />
                      <label htmlFor="firstTime" className="text-sm cursor-pointer text-slate-700">
                        I am a first-time homebuyer (or haven't owned in 3+ years)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="veteran"
                        checked={isVeteran}
                        onCheckedChange={(checked) => setIsVeteran(checked as boolean)}
                      />
                      <label htmlFor="veteran" className="text-sm cursor-pointer text-slate-700">
                        I am a veteran or active military
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="employer"
                        checked={hasEmployerProgram}
                        onCheckedChange={(checked) => setHasEmployerProgram(checked as boolean)}
                      />
                      <label htmlFor="employer" className="text-sm cursor-pointer text-slate-700">
                        My employer offers homebuying assistance
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700">
                    Find Assistance Programs
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <div className="text-sm font-bold text-slate-600uppercase tracking-wider mb-2">
                      Total Potential Assistance
                    </div>
                    <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-2">
                      {formatCurrency(totalAssistance)}
                    </div>
                    <div className="text-slate-600">
                      From {eligiblePrograms.length} eligible program{eligiblePrograms.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Button onClick={() => setShowResults(false)} variant="outline" className="font-bold">
                    Edit Criteria
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Programs List */}
            {eligiblePrograms.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Programs Found</h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Try adjusting your criteria. Many programs have income limits or location requirements.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {eligiblePrograms.map((program, idx) => {
                  const assistanceAmount = Math.min(program.maxAmount, price * (program.downPaymentPercent / 100));
                  
                  return (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  program.type === 'Federal' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                  program.type === 'State' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                }`}>
                                  {program.type}
                                </div>
                              </div>
                              <CardTitle className="text-xl text-slate-900">{program.name}</CardTitle>
                              <CardDescription className="mt-2">{program.description}</CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Up to</div>
                              <div className="text-2xl font-black text-green-600 dark:text-green-400">
                                {formatCurrency(assistanceAmount)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requirements:</div>
                              <ul className="space-y-1">
                                {program.requirements.map((req, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-3 pt-2">
                              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                                <a href={program.applicationUrl} target="_blank" rel="noopener noreferrer">
                                  Learn More <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Additional Resources */}
            <Card className="border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex gap-3">
                    <span className="font-bold">1.</span>
                    <span>Contact each program directly to verify current eligibility and apply</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">2.</span>
                    <span>Complete any required homebuyer education courses (often free online)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">3.</span>
                    <span>Get pre-approved for a mortgage with an approved lender</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">4.</span>
                    <span>Many programs can be combined - work with a housing counselor for maximum benefit</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
