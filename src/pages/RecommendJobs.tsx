
import { AgentLayout } from '@/components/agents/AgentLayout';

const RecommendJobs = () => {
  return (
    <AgentLayout
      title="Job Recommender"
      webhookUrl="https://n8n.erudites.in/webhook-test/recommend-jobs"
      inputPlaceholder="Enter your job preferences (location, role type, industry, etc.)..."
    />
  );
};

export default RecommendJobs;
