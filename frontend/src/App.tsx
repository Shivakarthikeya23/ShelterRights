import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { supabase } from "./lib/supabase";
import { ThemeProvider } from "./contexts/ThemeContext";

// Import styles
import "./index.css";

// Import pages
import LandingPage from "./pages/public/Landing";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import ProfileSetupPage from "./pages/auth/ProfileSetup";
import DashboardPage from "./pages/dashboard/Dashboard";
import RentCalculatorPage from "./pages/renter/RentCalculator";
import BuyCalculatorPage from "./pages/buyer/BuyCalculator";
import RentVsBuyPage from "./pages/buyer/RentVsBuy";
import AssistancePage from "./pages/buyer/Assistance";
import PropertySearchPage from "./pages/public/PropertySearch";
import RightsChatbotPage from "./pages/renter/RightsChatbot";
import CommunityOrganizerPage from "./pages/renter/CommunityOrganizer";
import ProfilePage from "./pages/user/Profile";
import PropertyTaxPage from "./pages/homeowner/PropertyTax";
import RefinancePage from "./pages/homeowner/Refinance";
import HOATrackerPage from "./pages/homeowner/HOATracker";
import ForeclosurePage from "./pages/homeowner/Foreclosure";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { setUser, setLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    initialize();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, initialize]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/search" element={<PropertySearchPage />} />

          {/* Protected routes */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rent-calculator"
            element={
              <ProtectedRoute>
                <RentCalculatorPage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/buy-calculator"
            element={
              <ProtectedRoute>
                <BuyCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rent-vs-buy"
            element={
              <ProtectedRoute>
                <RentVsBuyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistance"
            element={
              <ProtectedRoute>
                <AssistancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rights-chatbot"
            element={
              <ProtectedRoute>
                <RightsChatbotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organize"
            element={
              <ProtectedRoute>
                <CommunityOrganizerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/property-tax"
            element={
              <ProtectedRoute>
                <PropertyTaxPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refinance"
            element={
              <ProtectedRoute>
                <RefinancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hoa-tracker"
            element={
              <ProtectedRoute>
                <HOATrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foreclosure"
            element={
              <ProtectedRoute>
                <ForeclosurePage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
