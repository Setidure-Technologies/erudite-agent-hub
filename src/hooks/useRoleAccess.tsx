
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

export const useRoleAccess = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [accessibleAgents, setAccessibleAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRoleAndAgents();
    }
  }, [user]);

  const fetchUserRoleAndAgents = async () => {
    try {
      // Get user's role
      const { data: profileData, error: profileError } = await supabase
        .from('Profiles')
        .select(`
          role:roles(id, name, description)
        `)
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;

      const role = profileData?.role;
      setUserRole(role);

      if (role) {
        // Get accessible agents for this role
        const { data: agentAccessData, error: agentError } = await supabase
          .from('role_agent_access')
          .select(`
            agent:agents(id, name, description, route, icon, is_active)
          `)
          .eq('role_id', role.id)
          .eq('can_access', true);

        if (agentError) throw agentError;

        const agents = agentAccessData
          ?.map(item => item.agent)
          .filter(agent => agent && agent.is_active) || [];

        setAccessibleAgents(agents);
      }
    } catch (error) {
      console.error('Error fetching user role and agents:', error);
    } finally {
      setLoading(false);
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
    userRole,
    accessibleAgents,
    loading,
    hasAccess,
    isAdmin,
    isTeacher,
    isStudent,
    refetch: fetchUserRoleAndAgents
  };
};
