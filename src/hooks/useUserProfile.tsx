
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, Role } from '@/types/auth';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setError(null);
      
      // Get user's complete profile with role
      const { data: profileData, error: profileError } = await supabase
        .from('Profiles')
        .select(`
          *,
          role:roles(id, name, description)
        `)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Add special error message for infinite recursion
        if (
          profileError.message &&
          profileError.message.includes("infinite recursion detected in policy")
        ) {
          setError(
            "Platform misconfiguration: There is a permissions issue with role/profile table policies. Please contact the admin to fix the database Row Level Security settings."
          );
        } else {
          setError('Failed to fetch user profile');
        }
        return;
      }

      const role = profileData?.role;
      setUserRole(role);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    userProfile,
    userRole,
    loading,
    error,
    refetch: fetchUserProfile
  };
};
