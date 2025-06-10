
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AgentInputProps {
  inputPlaceholder: string;
  webhookUrl: string;
  title: string;
  profile: any;
  onResponse: (response: any) => void;
  onLogsUpdate: () => void;
  input?: string;
  setInput?: (input: string) => void;
}

export const AgentInput = ({ 
  inputPlaceholder, 
  webhookUrl, 
  title, 
  profile, 
  onResponse, 
  onLogsUpdate,
  input: externalInput,
  setInput: setExternalInput
}: AgentInputProps) => {
  const [internalInput, setInternalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Use either controlled or uncontrolled input
  const input = externalInput !== undefined ? externalInput : internalInput;
  const setInput = setExternalInput || setInternalInput;
  
  // Update internal state when external input changes
  useEffect(() => {
    if (externalInput !== undefined) {
      setInternalInput(externalInput);
    }
  }, [externalInput]);

  const runAgent = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some input.",
        variant: "destructive",
      });
      return;
    }

    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Webhook URL is not configured.",
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
      
      // Create FormData for the request
      const formData = new FormData();
      formData.append('user_id', user?.id || '');
      formData.append('input', input);
      formData.append('profile', JSON.stringify(profile || {}));
      
      // Set a reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
      }

      const responseText = await webhookResponse.text();
      console.log('Raw response text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        responseData = { content: responseText };
      }

      console.log('Webhook response:', responseData);
      onResponse(responseData);

      // Save to agent logs
      try {
        await supabase
          .from('agent_logs')
          .insert({
            user_id: user?.id,
            agent_name: title,
            input_data: requestData,
            response_data: responseData,
          });

        // Refresh logs
        onLogsUpdate();
      } catch (logError) {
        console.error('Error saving to agent logs:', logError);
        // Don't show error to user for logging failure
      }

      toast({
        title: "Success",
        description: "Agent executed successfully!",
      });

    } catch (error) {
      console.error('Error running agent:', error);
      
      let errorMessage = "Failed to run agent. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timeout. The webhook is taking too long to respond.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection and the webhook URL.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          rows={4}
          className="resize-y min-h-[100px]"
        />
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={runAgent} 
          disabled={loading || !input.trim()} 
          className="flex-1"
        >
          {loading ? 'Running Agent...' : 'Run Agent'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setInput('')}
          disabled={loading || !input}
          className="w-auto"
          title="Clear input"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
