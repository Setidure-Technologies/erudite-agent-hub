
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Shield, Users, Settings, Activity } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [roleAgentAccess, setRoleAgentAccess] = useState<any[]>([]);
  const [userSessions, setUserSessions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('Profiles')
        .select(`
          role:roles(name)
        `)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      const userIsAdmin = data?.role?.name === 'admin';
      setIsAdmin(userIsAdmin);
      
      if (!userIsAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges to access this page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesError) throw rolesError;
      setRoles(rolesData || []);

      // Fetch agents
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .order('name');

      if (agentsError) throw agentsError;
      setAgents(agentsData || []);

      // Fetch role-agent access
      const { data: accessData, error: accessError } = await supabase
        .from('role_agent_access')
        .select(`
          *,
          role:roles(name),
          agent:agents(name)
        `);

      if (accessError) throw accessError;
      setRoleAgentAccess(accessData || []);

      // Fetch recent user sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('vaakshakti_sessions')
        .select(`
          *,
          user:auth.users(email)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (sessionsError) throw sessionsError;
      setUserSessions(sessionsData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    }
  };

  const toggleAgentAccess = async (roleId: string, agentId: string, currentAccess: boolean) => {
    try {
      const { error } = await supabase
        .from('role_agent_access')
        .update({ can_access: !currentAccess })
        .eq('role_id', roleId)
        .eq('agent_id', agentId);

      if (error) throw error;

      // Update local state
      setRoleAgentAccess(prev => 
        prev.map(access => 
          access.role_id === roleId && access.agent_id === agentId
            ? { ...access, can_access: !currentAccess }
            : access
        )
      );

      toast({
        title: "Success",
        description: "Agent access updated successfully.",
      });
    } catch (error) {
      console.error('Error updating agent access:', error);
      toast({
        title: "Error",
        description: "Failed to update agent access.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      {/* Role-Agent Access Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Role-Agent Access Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Badge variant="outline">{role.name}</Badge>
                  {role.description}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {agents.map((agent) => {
                    const access = roleAgentAccess.find(
                      a => a.role_id === role.id && a.agent_id === agent.id
                    );
                    const canAccess = access?.can_access || false;

                    return (
                      <div key={agent.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.description}</div>
                        </div>
                        <Switch
                          checked={canAccess}
                          onCheckedChange={() => toggleAgentAccess(role.id, agent.id, canAccess)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Sessions Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent VaakShakti Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">Question: {session.question}</div>
                    <div className="text-sm text-gray-500">
                      User: {session.user?.email || 'Unknown'} | 
                      Duration: {session.duration_seconds ? `${session.duration_seconds}s` : 'N/A'}
                    </div>
                  </div>
                  {session.fluency_score && (
                    <Badge variant={session.fluency_score >= 80 ? "default" : session.fluency_score >= 60 ? "secondary" : "destructive"}>
                      Score: {session.fluency_score}%
                    </Badge>
                  )}
                </div>
                {session.transcript && (
                  <div className="text-sm bg-gray-50 p-2 rounded mt-2">
                    <strong>Transcript:</strong> {session.transcript}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{roles.length}</div>
            <div className="text-sm text-gray-500">Total roles in system</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{agents.length}</div>
            <div className="text-sm text-gray-500">Available AI agents</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userSessions.length}</div>
            <div className="text-sm text-gray-500">Recent training sessions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
