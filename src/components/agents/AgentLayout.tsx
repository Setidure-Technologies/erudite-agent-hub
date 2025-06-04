
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSidebar } from './ProfileSidebar';
import { AgentInput } from './AgentInput';
import { AgentResponse } from './AgentResponse';
import { AgentHistory } from './AgentHistory';

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
  const [response, setResponse] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAgentLogs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log('AgentLayout - Fetching profile for user:', user?.id);
      const { data, error } = await supabase
        .from('Profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      console.log('AgentLayout - Profile fetch result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
      console.log('AgentLayout - Profile set to:', data);
    } catch (error) {
      console.error('AgentLayout - Error fetching profile:', error);
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
        .limit(10);

      if (error) throw error;
      setAgentLogs(data || []);
    } catch (error) {
      console.error('Error fetching agent logs:', error);
    }
  };
  
  const handleSelectInputFromHistory = (input: string) => {
    setCurrentInput(input);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Sidebar */}
      <div className="lg:col-span-1">
        <ProfileSidebar profile={profile} />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AgentInput
              inputPlaceholder={inputPlaceholder}
              webhookUrl={webhookUrl}
              title={title}
              profile={profile}
              onResponse={setResponse}
              onLogsUpdate={fetchAgentLogs}
              input={currentInput}
              setInput={setCurrentInput}
            />

            <AgentResponse response={response} />

            {children}
          </CardContent>
        </Card>

        <AgentHistory 
          agentLogs={agentLogs} 
          onSelectInput={handleSelectInputFromHistory}
        />
      </div>
    </div>
  );
};
