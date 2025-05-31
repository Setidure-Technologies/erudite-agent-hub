
import { AgentLayout } from '@/components/agents/AgentLayout';

const AnalyzeSkillGap = () => {
  return (
    <AgentLayout
      title="Skill Gap Analyzer"
      webhookUrl="https://n8n.erudites.in/webhook/analyze-skill-gap"
      inputPlaceholder="Paste the job description here to analyze skill gaps..."
    />
  );
};

export default AnalyzeSkillGap;
