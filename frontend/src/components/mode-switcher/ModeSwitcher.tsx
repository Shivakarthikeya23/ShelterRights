import { useUserStore, UserMode } from '../../stores/userStore';
import { userApi } from '../../lib/userApi';
import { Button } from '../ui/button';
import { Home, ShoppingCart, Building } from 'lucide-react';

export default function ModeSwitcher() {
  const { profile, switchMode } = useUserStore();

  if (!profile) return null;

  const handleSwitch = async (mode: UserMode) => {
    try {
      await userApi.switchMode(mode);
      switchMode(mode);
    } catch (error) {
      console.error('Failed to switch mode:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
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
