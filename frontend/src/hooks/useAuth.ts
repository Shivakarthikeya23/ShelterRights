import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

export function useAuth(requireAuth: boolean = true) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, requireAuth, navigate]);

  return { user, isAuthenticated, isLoading };
}

// Hook to handle signup
export function useSignup() {
  return async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return data;
  };
}

// Hook to handle login
export function useLogin() {
  return async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };
}

// Hook to handle logout
export function useLogout() {
  const { logout } = useAuthStore();
  return logout;
}
