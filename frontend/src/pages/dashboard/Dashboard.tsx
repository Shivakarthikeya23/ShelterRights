import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { userApi } from '../../lib/userApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ModeSwitcher from '../../components/mode-switcher/ModeSwitcher';
import AppHeader from '../../components/layout/AppHeader';
import { 
  LogOut, 
  Calculator, 
  MessageSquare, 
  Users, 
  Home, 
  TrendingUp, 
  Search, 
  ArrowRight,
  Award,
  LineChart,
  Shield,
  DollarSign,
  Building
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { profile, setProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload profile when mode changes to ensure features update
  useEffect(() => {
    if (profile?.currentMode) {
      // Profile mode changed, ensure UI updates by reloading
      const timer = setTimeout(() => {
        loadProfile();
      }, 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.currentMode]);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renterFeatures = [
    {
      title: 'Rent Calculator',
      description: 'Analyze your housing costs against the "30% Rule" with AI-powered financial insights.',
      icon: Calculator,
      color: 'blue',
      link: '/rent-calculator'
    },
    {
      title: 'Tenant Rights Chat',
      description: 'Get instant answers about tenant rights and housing laws using AI assistance.',
      icon: MessageSquare,
      color: 'green',
      link: '/rights-chatbot'
    },
    {
      title: 'Community Organizer',
      description: 'Create and sign petitions for housing justice in your community.',
      icon: Users,
      color: 'purple',
      link: '/organize'
    }
  ];

  const buyerFeatures = [
    {
      title: 'Buying Power Calculator',
      description: 'Discover your true purchasing potential - bank approval vs. realistic budget.',
      icon: TrendingUp,
      color: 'purple',
      link: '/buy-calculator'
    },
    {
      title: 'Rent vs Buy Analyzer',
      description: 'Compare the total cost of renting versus buying over time with break-even analysis.',
      icon: LineChart,
      color: 'amber',
      link: '/rent-vs-buy'
    },
    {
      title: 'Down Payment Assistance',
      description: 'Find federal, state, and local programs to help with your down payment.',
      icon: Award,
      color: 'green',
      link: '/assistance'
    },
  ];

  // Determine current mode - default to renter if profile not loaded or mode not set
  const currentMode = profile?.currentMode || (profile?.isRenter ? 'renter' : profile?.isBuyer ? 'buyer' : 'renter');
  
  // Show features based on enabled preferences, not just current mode
  // If user has both renter and buyer enabled, show features for current mode
  // But also show property search for both if either is enabled
  let features: typeof renterFeatures = [];
  
  if (currentMode === 'renter' && profile?.isRenter) {
    features = renterFeatures;
  } else if (currentMode === 'buyer' && profile?.isBuyer) {
    features = buyerFeatures;
  } else if (currentMode === 'owner' && profile?.isOwner) {
    // Owner mode - show relevant features
    features = [
      {
        title: 'Property Tax Burden Check',
        description: 'Analyze your property tax burden and project future increases.',
        icon: DollarSign,
        color: 'red',
        link: '/property-tax'
      },
      {
        title: 'Refinance Analyzer',
        description: 'Determine if refinancing your mortgage makes financial sense.',
        icon: TrendingUp,
        color: 'green',
        link: '/refinance'
      },
      {
        title: 'HOA Abuse Tracker',
        description: 'Track HOA fee increases and compare with community data.',
        icon: Building,
        color: 'amber',
        link: '/hoa-tracker'
      },
      {
        title: 'Foreclosure Prevention',
        description: 'Get immediate help if you\'re falling behind on payments.',
        icon: Shield,
        color: 'red',
        link: '/foreclosure'
      }
    ];
  } else {
    // Fallback: show based on what's enabled
    if (profile?.isRenter) {
      features = renterFeatures;
    } else if (profile?.isBuyer) {
      features = buyerFeatures;
    } else {
      features = renterFeatures; // Default
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        border: 'bg-blue-600',
        icon: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        linkColor: 'text-blue-600 dark:text-blue-400'
      },
      purple: {
        border: 'bg-purple-600',
        icon: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        linkColor: 'text-purple-600 dark:text-purple-400'
      },
      green: {
        border: 'bg-green-600',
        icon: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        linkColor: 'text-green-600 dark:text-green-400'
      },
      amber: {
        border: 'bg-amber-600',
        icon: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        linkColor: 'text-amber-600 dark:text-amber-400'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
           <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Welcome, {user?.user_metadata?.full_name || profile?.fullName || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
            {currentMode === 'renter' 
              ? 'Access renter-focused tools to understand your housing costs and protect your rights.'
              : 'Explore homebuyer tools to make informed decisions about purchasing property.'}
          </p>
          
          {/* PROMINENT Mode Switcher - Always show if profile exists */}
          {profile ? (
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">Switch Mode:</span>
              </div>
              <ModeSwitcher />
              {(!profile.isRenter && !profile.isBuyer && !profile.isOwner) && (
                <div className="ml-4 text-sm text-amber-600 dark:text-amber-400">
                  Complete profile setup to enable mode switching
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Loading your profile...
              </p>
            </div>
          )}
        </header>

        {features.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
            const Icon = feature.icon;
            const colors = getColorClasses(feature.color);
            
            return (
              <Link key={feature.link} to={feature.link} className="group">
                <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-0 shadow-lg group-hover:-translate-y-2 overflow-hidden bg-white dark:bg-slate-900">
                  <div className={`h-2 ${colors.border} w-full`} />
                  <CardHeader>
                    <div className={`${colors.icon} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${colors.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className={`flex items-center ${colors.linkColor} font-bold text-sm`}>
                       Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          
          {/* Property Search - Available to both renter and buyer modes */}
          {(currentMode === 'renter' || currentMode === 'buyer') && (
            <Link to="/search" className="group">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-0 shadow-lg group-hover:-translate-y-2 overflow-hidden bg-white dark:bg-slate-900">
                <div className="h-2 bg-green-600 w-full" />
                <CardHeader>
                  <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">AI Property Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {currentMode === 'renter' 
                      ? 'Search rental listings with automated affordability analysis and AI insights.'
                      : 'Search properties with AI-powered recommendations and affordability analysis.'}
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-sm">
                     Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No features available. Please complete your profile setup.
            </p>
          </div>
        )}

        {/* Mode Switch Suggestion */}
        <div className="mt-12 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                {currentMode === 'renter' ? 'Planning to Buy?' : 'Back to Renting?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {currentMode === 'renter' 
                  ? 'Switch to Buyer mode in the top right to access homebuying tools like Rent vs Buy analysis and Down Payment assistance.'
                  : 'Switch to Renter mode to access rent calculators, tenant rights chat, and community organizing tools.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
