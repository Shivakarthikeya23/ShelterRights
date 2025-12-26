import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { userApi } from '../../lib/userApi';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import ModeSwitcher from '../../components/mode-switcher/ModeSwitcher';
import { LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ShelterRights</h1>
          <div className="flex items-center gap-4">
            {profile && <ModeSwitcher />}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {profile?.fullName || user?.email}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Current Mode: <span className="font-semibold capitalize">{profile?.currentMode}</span></p>
              <p className="text-muted-foreground">
                Features will be added in Phase 2 and Phase 3!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
