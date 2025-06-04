import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChatInterface } from '@/components/agents/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const RecommendJobs = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');

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

  const extraFields: Record<string, string> = {};
  if (company) extraFields.company = company;
  if (role) extraFields.role = role;
  if (jobDesc) extraFields.job_description = jobDesc;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
        <Input placeholder="Role (optional)" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <Textarea
        placeholder="Paste job description or requirements (optional)"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        className="min-h-[120px]"
      />
      <ChatInterface
        title="Job Recommender"
        webhookUrl="https://n8n.erudites.in/webhook-test/recommend-jobs"
        profile={profile}
        extraFields={extraFields}
      />
    </div>
  );
};

export default RecommendJobs;
