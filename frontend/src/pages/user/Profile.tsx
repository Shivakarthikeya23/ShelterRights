import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { userApi } from '../../lib/userApi';
import AppHeader from '../../components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { User, Home, ShoppingCart, Building, Save, CheckCircle2, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { US_STATES } from '../../lib/constants';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, setProfile, updateProfile } = useUserStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [fullName, setFullName] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationState, setLocationState] = useState('');
  const [isRenter, setIsRenter] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      const prof = data.profile;
      setProfile(prof);
      
      // Populate form
      setFullName(prof.fullName || '');
      setAnnualIncome(prof.annualIncome?.toString() || '');
      setLocationCity(prof.locationCity || '');
      setLocationState(prof.locationState || '');
      setIsRenter(prof.isRenter || false);
      setIsBuyer(prof.isBuyer || false);
      setIsOwner(prof.isOwner || false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const updated = await userApi.updateProfile({
        fullName: fullName || undefined,
        annualIncome: annualIncome ? parseFloat(annualIncome) : undefined,
        locationCity: locationCity || undefined,
        locationState: locationState || undefined,
        isRenter,
        isBuyer,
        isOwner,
      });

      updateProfile(updated.profile);
      setSuccess('Profile updated successfully!');
      
      // Reload to get fresh data
      setTimeout(() => {
        loadProfile();
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {fullName ? `Profile - ${fullName}` : 'Profile'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences</p>
          {(fullName || locationCity || locationState || annualIncome) && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {fullName && (
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Name:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{fullName}</span>
                  </div>
                )}
                {(locationCity || locationState) && (
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Location:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">
                      {locationCity || 'Not set'}{locationCity && locationState ? ', ' : ''}
                      {locationState ? US_STATES.find(s => s.value === locationState)?.label : ''}
                    </span>
                  </div>
                )}
                {annualIncome && (
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Income:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">${parseInt(annualIncome).toLocaleString()}/year</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-slate-100 dark:bg-slate-800" />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            {fullName && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Display Name:</strong> {fullName}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Housing Preferences</CardTitle>
            <CardDescription>Select which modes you want to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <Checkbox 
                  id="renter" 
                  checked={isRenter}
                  onCheckedChange={(checked: boolean) => setIsRenter(checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="renter" className="cursor-pointer flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Renter</div>
                      <div className="text-sm text-muted-foreground">
                        Access rent calculators and tenant rights tools
                      </div>
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
                  <Label htmlFor="buyer" className="cursor-pointer flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Homebuyer</div>
                      <div className="text-sm text-muted-foreground">
                        Access buying power calculators and homebuying tools
                      </div>
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
                  <Label htmlFor="owner" className="cursor-pointer flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Homeowner</div>
                      <div className="text-sm text-muted-foreground">
                        Access homeowner resources
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Income
            </CardTitle>
            <CardDescription>Help us personalize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="annualIncome" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Annual Income
              </Label>
              <Input
                id="annualIncome"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                placeholder="50000"
              />
              {annualIncome && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Current: ${parseInt(annualIncome || '0').toLocaleString()}/year
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  placeholder="Austin"
                />
                {locationCity && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {locationCity}
                  </p>
                )}
              </div>
              <div>
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
                {locationState && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {US_STATES.find(s => s.value === locationState)?.label || locationState}
                  </p>
                )}
              </div>
            </div>
            {(locationCity || locationState || annualIncome) && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Location:</strong> {locationCity ? locationCity : 'Not set'}{locationCity && locationState ? ', ' : ''}{locationState ? US_STATES.find(s => s.value === locationState)?.label : ''}
                  {annualIncome && (
                    <>
                      <br />
                      <strong>Income:</strong> ${parseInt(annualIncome).toLocaleString()}/year
                    </>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

