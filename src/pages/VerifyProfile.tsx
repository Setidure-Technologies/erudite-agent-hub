
import { AgentLayout } from '@/components/agents/AgentLayout';

const VerifyProfile = () => {
  return (
    <AgentLayout
      title="Verify Profile Agent"
      webhookUrl="https://n8n.erudites.in/webhook-test/verify-profile"
      inputPlaceholder="Enter resume URL or additional information to verify profile..."
    />
  );
};

export default VerifyProfile;
