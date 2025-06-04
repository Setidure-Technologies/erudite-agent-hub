
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ChatInterface } from '@/components/agents/ChatInterface';

const InterviewCoach = () => {
  const [profile, setProfile] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Coach</h1>
        <p className="text-gray-600">Get personalized interview preparation guidance and practice with your AI coach.</p>
      </div>
      
      <ChatInterface
        title="Interview Coach"
        webhookUrl="https://n8n.erudites.in/webhook-test/interview-coach-debug-123"
        initialMessage="Hello! I'm your Interview Coach. I'm here to help you prepare for your upcoming interviews. I can help you with:

• Mock interview practice
• Common interview questions
• Industry-specific preparation  
• Behavioral question techniques
• Technical interview prep
• Confidence building tips

What would you like to work on today?"
        profile={profile}
      />
    </div>
  );
};

export default InterviewCoach;
