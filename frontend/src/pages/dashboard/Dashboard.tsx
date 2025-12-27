import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { userApi } from '../../lib/userApi';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ModeSwitcher from '../../components/mode-switcher/ModeSwitcher';
import { LogOut, Calculator, MessageSquare, Users, Home, TrendingUp, Search, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { profile, setProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data.profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          <Link to="/dashboard" className="flex items-center gap-2">
             <div className="bg-blue-600 rounded-lg p-1.5">
               <Home className="h-5 w-5 text-white" />
             </div>
             <h1 className="text-xl font-bold tracking-tight">ShelterRights</h1>
          </Link>
          <div className="flex items-center gap-4">
            {profile && <ModeSwitcher />}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
           <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Welcome, {profile?.fullName || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Select a tool below to begin your housing journey. All your data is securely stored and analyzed by GPT-4o-mini.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Rent Calculator */}
          <Link to="/rent-calculator" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-0 shadow-lg group-hover:-translate-y-2 overflow-hidden bg-white dark:bg-slate-900">
              <div className="h-2 bg-blue-600 w-full" />
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Rent Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Analyze your housing costs against the "30% Rule" and get professional financial insights.
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                   Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Buy Calculator */}
          <Link to="/buy-calculator" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-0 shadow-lg group-hover:-translate-y-2 overflow-hidden bg-white dark:bg-slate-900">
              <div className="h-2 bg-purple-600 w-full" />
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Buying Power</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Discover your true purchasing potential by comparing bank logic vs. realistic budgeting.
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                   Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Property Search */}
          <Link to="/search" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-0 shadow-lg group-hover:-translate-y-2 overflow-hidden bg-white dark:bg-slate-900">
              <div className="h-2 bg-green-600 w-full" />
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">AI Property Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Aggregate listings from Zillow, Craigslist, and more with automated affordability analysis.
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-sm">
                   Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Scaffolding for others */}
          <div className="opacity-60 cursor-not-allowed">
            <Card className="h-full border-0 shadow-md bg-slate-100 dark:bg-slate-800/50">
              <CardHeader>
                <div className="bg-slate-200 dark:bg-slate-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-slate-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Rights Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-6">
                  AI-powered legal assistance and housing rights information coming soon.
                </p>
                <div className="text-slate-300 font-bold text-sm uppercase tracking-widest text-xs">
                   Deployment Pending
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="opacity-60 cursor-not-allowed">
            <Card className="h-full border-0 shadow-md bg-slate-100 dark:bg-slate-800/50">
              <CardHeader>
                <div className="bg-slate-200 dark:bg-slate-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-slate-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Campaign Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 mb-6 text-sm italic leading-relaxed">
                  "Find your neighbors and organize for local policy change in 1-click." 
                </p>
                <div className="text-slate-300 font-bold text-sm uppercase tracking-widest text-xs">
                   Deployment Pending
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
