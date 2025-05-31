
import { AgentLayout } from '@/components/agents/AgentLayout';

const InterviewCoach = () => {
  return (
    <AgentLayout
      title="Interview Coach"
      webhookUrl="https://n8n.erudites.in/webhook/interview-coach"
      inputPlaceholder="Enter interview mode (online/offline) and job description..."
    />
  );
};

export default InterviewCoach;
