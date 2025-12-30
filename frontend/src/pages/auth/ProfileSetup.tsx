import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../lib/userApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2 } from 'lucide-react';
import { US_STATES } from '../../lib/constants';

export default function ProfileSetupPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 1: User type
  const [isRenter, setIsRenter] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  // Step 2: Basic info
  const [fullName, setFullName] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationState, setLocationState] = useState('');
  const [locationZip, setLocationZip] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Determine default mode based on selections
      let currentMode: 'renter' | 'buyer' | 'owner' = 'renter';
      if (isBuyer) currentMode = 'buyer';
      else if (isOwner) currentMode = 'owner';

      await userApi.setupProfile({
        fullName: fullName || undefined,
        annualIncome: parseFloat(annualIncome),
        locationCity,
        locationState,
        locationZip,
        isRenter,
        isBuyer,
        isOwner,
        currentMode
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to setup profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us about your housing situation to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">I am a... (select all that apply)</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <Checkbox 
                    id="renter" 
                    checked={isRenter}
                    onCheckedChange={(checked: boolean) => setIsRenter(checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="renter" className="cursor-pointer">
                      <div className="font-medium">Renter</div>
                      <div className="text-sm text-muted-foreground">
                        Currently renting or looking for rentals
                      </div>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <Checkbox 
                    id="buyer" 
                    checked={isBuyer}
                    onCheckedChange={(checked: boolean) => setIsBuyer(checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="buyer" className="cursor-pointer">
                      <div className="font-medium">Homebuyer</div>
                      <div className="text-sm text-muted-foreground">
                        Planning to buy a home
                      </div>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                  <Checkbox 
                    id="owner" 
                    checked={isOwner}
                    onCheckedChange={(checked: boolean) => setIsOwner(checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="owner" className="cursor-pointer">
                      <div className="font-medium">Homeowner</div>
                      <div className="text-sm text-muted-foreground">
                        Already own a home
                      </div>
                    </Label>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!isRenter && !isBuyer && !isOwner}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e: any) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="50000"
                  value={annualIncome}
                  onChange={(e: any) => setAnnualIncome(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Austin"
                    value={locationCity}
                    onChange={(e: any) => setLocationCity(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={locationState} onValueChange={setLocationState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  placeholder="78701"
                  value={locationZip}
                  onChange={(e: any) => setLocationZip(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading || !fullName || !annualIncome || !locationCity || !locationState}
                  className="flex-1"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
