
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
      
      const webhookResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status}`);
      }

      const responseData = await webhookResponse.json();
      console.log('Webhook response:', responseData);
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
        description: "Failed to run agent. Please try again.",
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
