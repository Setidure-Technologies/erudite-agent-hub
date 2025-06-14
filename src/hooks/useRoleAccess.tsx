
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Agent {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  is_active: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role_id: string;
  role: Role;
  [key: string]: any; // For all the dynamic profile fields
}

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [accessibleAgents, setAccessibleAgents] = useState<Agent[]>([]);
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRoleAndAgents();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoleAndAgents = async () => {
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
        setError('Failed to fetch user profile');
        return;
      }

      const role = profileData?.role;
      setUserRole(role);
      setUserProfile(profileData);

      if (role) {
        // Get accessible agents for this role
        const { data: agentAccessData, error: agentError } = await supabase
          .from('role_agent_access')
          .select(`
            agent:agents(id, name, description, route, icon, is_active)
          `)
          .eq('role_id', role.id)
          .eq('can_access', true);

        if (agentError) {
          console.error('Agent access error:', agentError);
        } else {
          const agents = agentAccessData
            ?.map(item => item.agent)
            .filter(agent => agent && agent.is_active) || [];
          setAccessibleAgents(agents);
        }

        // If admin or teacher, fetch additional data
        if (role.name === 'admin' || role.name === 'teacher') {
          await fetchAdditionalData();
        }
      }
    } catch (error) {
      console.error('Error fetching user role and agents:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      // Fetch all students for admin/teacher view
      const { data: studentsData, error: studentsError } = await supabase
        .from('Profiles')
        .select(`
          *,
          role:roles(id, name, description)
        `)
        .order('created_at', { ascending: false });

      if (studentsError) {
        console.error('Students fetch error:', studentsError);
      } else {
        setAllStudents(studentsData || []);
      }

      // Fetch all VaakShakti sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('vaakshakti_sessions')
        .select(`
          *,
          feedback:vaakshakti_feedback(*)
        `)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Sessions fetch error:', sessionsError);
      } else {
        setAllSessions(sessionsData || []);
      }

    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  const hasAccess = (agentRoute: string) => {
    return accessibleAgents.some(agent => agent.route === agentRoute);
  };

  const isAdmin = () => {
    return userRole?.name === 'admin';
  };

  const isTeacher = () => {
    return userRole?.name === 'teacher';
  };

  const isStudent = () => {
    return userRole?.name === 'student';
  };

  return {
    userProfile,
    userRole,
    accessibleAgents,
    allStudents,
    allSessions,
    loading,
    error,
    hasAccess,
    isAdmin,
    isTeacher,
    isStudent,
    refetch: fetchUserRoleAndAgents
  };
};
