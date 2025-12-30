import { useUserStore, UserMode } from '../../stores/userStore';
import { userApi } from '../../lib/userApi';
import { Button } from '../ui/button';
import { Home, ShoppingCart, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModeSwitcher() {
  const { profile, switchMode } = useUserStore();
  const navigate = useNavigate();

  if (!profile) return null;

  const handleSwitch = async (mode: UserMode) => {
    try {
      await userApi.switchMode(mode);
      switchMode(mode);
      // State management will automatically update the UI - no reload needed!
    } catch (error) {
      console.error('Failed to switch mode:', error);
    }
  };

  const hasAnyMode = profile.isRenter || profile.isBuyer || profile.isOwner;

  if (!hasAnyMode) {
    return (
      <div className="text-sm text-amber-600 dark:text-amber-400">
        Complete profile setup to enable mode switching
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg">
      {profile.isRenter && (
        <Button
          variant={profile.currentMode === 'renter' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleSwitch('renter')}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Renter
        </Button>
      )}
      
      {profile.isBuyer && (
        <Button
          variant={profile.currentMode === 'buyer' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleSwitch('buyer')}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Buyer
        </Button>
      )}
      
      {profile.isOwner && (
        <Button
          variant={profile.currentMode === 'owner' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleSwitch('owner')}
          className="gap-2"
        >
          <Building className="h-4 w-4" />
          Owner
        </Button>
      )}
    </div>
  );
}
