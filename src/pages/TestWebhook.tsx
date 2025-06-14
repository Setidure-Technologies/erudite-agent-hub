
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TestWebhook = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [testPayload, setTestPayload] = useState('');
  const [response, setResponse] = useState<any>(null);

  const agents = [
    { id: 'recommend-jobs', name: 'Job Recommendations', endpoint: '/recommend-jobs' },
    { id: 'analyze-skills', name: 'Skill Analysis', endpoint: '/analyze-skills' },
    { id: 'generate-resume', name: 'Resume Generator', endpoint: '/generate-resume' },
    { id: 'interview-prep', name: 'Interview Preparation', endpoint: '/interview-prep' },
    { id: 'track-performance', name: 'Performance Tracking', endpoint: '/track-performance' }
  ];

  const samplePayloads = {
    'recommend-jobs': {
      user_id: 'sample-user-id',
      job_preferences: {
        desired_role: 'Software Engineer',
        experience_level: 'junior',
        preferred_location: 'Bangalore',
        skills: 'React, Node.js, JavaScript',
        industry_preference: 'technology'
      }
    },
    'analyze-skills': {
      user_id: 'sample-user-id',
      current_skills: ['JavaScript', 'React', 'HTML', 'CSS'],
      target_role: 'Senior Frontend Developer'
    },
    'generate-resume': {
      user_id: 'sample-user-id',
      profile_data: {
        name: 'John Doe',
        email: 'john@example.com',
        education: 'B.Tech Computer Science',
        experience: '2 years'
      }
    }
  };

  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    const sample = samplePayloads[agentId as keyof typeof samplePayloads];
    if (sample) {
      setTestPayload(JSON.stringify(sample, null, 2));
    }
    setResponse(null);
  };

  const handleTestWebhook = async () => {
    if (!selectedAgent || !testPayload) {
      toast({
        title: "Error",
        description: "Please select an agent and provide test payload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.VITE_WEBHOOK_BASE_URL || 'https://webhook.example.com';
      const agent = agents.find(a => a.id === selectedAgent);
      const webhookUrl = `${baseUrl}${agent?.endpoint}`;

      console.log('Testing webhook:', webhookUrl);
      console.log('Payload:', testPayload);

      // For demo purposes, simulate webhook response
      setTimeout(() => {
        const mockResponse = {
          status: 'success',
          timestamp: new Date().toISOString(),
          agent: agent?.name,
          processing_time: '1.2s',
          data: {
            message: 'Webhook processed successfully',
            results: 'Sample results would appear here',
            recommendations: ['Sample recommendation 1', 'Sample recommendation 2']
          }
        };

        setResponse(mockResponse);
        toast({
          title: "Success",
          description: "Webhook test completed successfully!",
        });
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Webhook test error:', error);
      toast({
        title: "Error",
        description: "Webhook test failed. Please check the configuration.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Webhook Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Test webhook endpoints for all AI agents to ensure proper integration with n8n automation engine.
          </p>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Agent</label>
            <Select value={selectedAgent} onValueChange={handleAgentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent to test" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.endpoint})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test Payload (JSON)</label>
            <Textarea
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              placeholder="Enter JSON payload to test..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleTestWebhook} 
            disabled={loading || !selectedAgent || !testPayload}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Webhook...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Test Webhook
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Webhook Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className={`font-semibold ${response.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {response.status}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Agent</div>
                  <div className="font-semibold">{response.agent}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Processing Time</div>
                  <div className="font-semibold">{response.processing_time}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Timestamp</div>
                  <div className="font-semibold text-xs">{new Date(response.timestamp).toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Full Response</div>
                <pre className="bg-white p-3 rounded border text-xs overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook URLs Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook URLs Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {agents.map((agent) => (
              <div key={agent.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{agent.name}</span>
                <code className="text-sm bg-white px-2 py-1 rounded border">
                  {process.env.VITE_WEBHOOK_BASE_URL || 'https://webhook.example.com'}{agent.endpoint}
                </code>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Set VITE_WEBHOOK_BASE_URL environment variable to configure the base webhook URL for your n8n instance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestWebhook;
