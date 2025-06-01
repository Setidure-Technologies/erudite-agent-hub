
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

    setLoading(true);
    try {
      const requestData = {
        user_id: user?.id,
        input: input,
        profile: profile,
      };

      console.log(`Making request to ${webhookUrl} with data:`, requestData);
      
      // Create URL with query parameters for GET request
      const queryParams = new URLSearchParams({
        user_id: user?.id || '',
        input: input,
        profile: JSON.stringify(profile || {}),
      });
      
      const fullUrl = `${webhookUrl}?${queryParams.toString()}`;
      console.log('Full URL:', fullUrl);
      
      const webhookResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      console.log('Response status:', webhookResponse.status);
      console.log('Response headers:', Object.fromEntries(webhookResponse.headers.entries()));

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
      }

      // Check if response has content
      const contentLength = webhookResponse.headers.get('content-length');
      console.log('Content length:', contentLength);

      if (contentLength === '0') {
        throw new Error('Webhook returned empty response. Check your n8n workflow has a "Respond to Webhook" node.');
      }

      const responseText = await webhookResponse.text();
      console.log('Raw response text:', responseText);

      if (!responseText || responseText.trim() === '') {
        throw new Error('Webhook returned empty response body. Make sure your n8n workflow returns data.');
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.log('Response is not JSON, using as text:', responseText);
        responseData = { message: responseText };
      }

      console.log('Parsed response data:', responseData);
      onResponse(responseData);

      // Save to agent logs
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

      toast({
        title: "Success",
        description: "Agent executed successfully!",
      });

    } catch (error) {
      console.error('Error running agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run agent. Please try again.",
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
          disabled={loading} 
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
