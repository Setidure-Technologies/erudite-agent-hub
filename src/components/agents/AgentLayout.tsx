
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AgentLayoutProps {
  title: string;
  webhookUrl: string;
  inputPlaceholder?: string;
  children?: React.ReactNode;
}

export const AgentLayout = ({ 
  title, 
  webhookUrl, 
  inputPlaceholder = "Enter your input...",
  children 
}: AgentLayoutProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAgentLogs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('Profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAgentLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .eq('user_id', user?.id)
        .eq('agent_name', title)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setAgentLogs(data || []);
    } catch (error) {
      console.error('Error fetching agent logs:', error);
    }
  };

  const runAgent = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some input.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        user_id: user?.id,
        input: input,
        profile: profile,
      };

      console.log(`Making request to ${webhookUrl} with data:`, requestData);

      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status}`);
      }

      const responseData = await webhookResponse.json();
      console.log('Webhook response:', responseData);
      setResponse(responseData);

      // Save to agent logs
      await supabase
        .from('agent_logs')
        .insert({
          user_id: user?.id,
          agent_name: title,
          input_data: requestData,
          response_data: responseData,
        });

      // Refresh logs
      fetchAgentLogs();

      toast({
        title: "Success",
        description: "Agent executed successfully!",
      });

    } catch (error) {
      console.error('Error running agent:', error);
      toast({
        title: "Error",
        description: "Failed to run agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Profile Data</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {profile.name || 'Not set'}</div>
                <div><strong>Email:</strong> {profile.email || 'Not set'}</div>
                <div><strong>Skills:</strong> {profile['technical skills of the student'] || 'Not set'}</div>
                <div><strong>Education:</strong> {profile['type of degree obtained during graduation'] || 'Not set'}</div>
                <div><strong>Experience:</strong> {profile['total work experience of the student in months'] || '0'} months</div>
              </div>
            ) : (
              <p className="text-gray-500">No profile data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                rows={4}
              />
            </div>

            <Button onClick={runAgent} disabled={loading} className="w-full">
              {loading ? 'Running Agent...' : 'Run Agent'}
            </Button>

            {response && (
              <div>
                <label className="block text-sm font-medium mb-2">Response</label>
                <div className="p-4 bg-gray-50 rounded-md max-h-96 overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {children}
          </CardContent>
        </Card>

        {/* Agent History */}
        {agentLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentLogs.map((log) => (
                  <div key={log.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <strong>Input:</strong> {JSON.stringify(log.input_data?.input || log.input_data, null, 2).slice(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
