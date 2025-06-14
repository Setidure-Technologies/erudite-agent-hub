
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Agent, Role } from '@/types/auth';

export const useAgentAccess = (userRole: Role | null) => {
  const [accessibleAgents, setAccessibleAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessibleAgents = async () => {
    if (!userRole) return;

    try {
      setLoading(true);
      setError(null);

      const { data: agentAccessData, error: agentError } = await supabase
        .from('role_agent_access')
        .select(`
          agent:agents(id, name, description, route, icon, is_active)
        `)
        .eq('role_id', userRole.id)
        .eq('can_access', true);

      if (agentError) {
        console.error('Agent access error:', agentError);
        setError('Failed to fetch accessible agents');
      } else {
        const agents = agentAccessData
          ?.map(item => item.agent)
          .filter(agent => agent && agent.is_active) || [];
        setAccessibleAgents(agents);
      }
    } catch (error) {
      console.error('Error fetching accessible agents:', error);
      setError('Failed to load agent access data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessibleAgents();
  }, [userRole]);

  const hasAccess = (agentRoute: string) => {
    return accessibleAgents.some(agent => agent.route === agentRoute);
  };

  return {
    accessibleAgents,
    hasAccess,
    loading,
    error,
    refetch: fetchAccessibleAgents
  };
};
