import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Home, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Take Control of Your Housing Future
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            131 Million Americans struggle with housing affordability. 
            You're not alone. We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <Home className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Affordability Tools</h3>
            <p className="text-muted-foreground">
              Calculate rent burden, find assistance programs, and make informed housing decisions.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Know Your Rights</h3>
            <p className="text-muted-foreground">
              AI-powered tenant rights assistant helps you understand and enforce your protections.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Power</h3>
            <p className="text-muted-foreground">
              Connect with neighbors and organize for policy change that helps everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
