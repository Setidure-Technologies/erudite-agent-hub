import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/agents/ChatInterface';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyzeSkillGap = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('Profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const chartData = profile
    ? [
        {
          name: 'Class 10',
          percentage: profile['percentage marks scored in class 10'] || 0,
        },
        {
          name: 'Class 12',
          percentage: profile['percentage marks scored in class 12'] || 0,
        },
        {
          name: 'Graduation',
          percentage: profile['percentage marks obtained during graduation'] || 0,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Academic Performance Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ChatInterface
        title="Skill Gap Analyzer"
        webhookUrl="https://n8n.erudites.in/webhook-test/analyze-skill-gap"
        profile={profile}
      />
    </div>
  );
};

export default AnalyzeSkillGap;
