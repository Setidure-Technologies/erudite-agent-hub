
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  title: string;
  webhookUrl: string;
  initialMessage?: string;
  profile: any;
  extraFields?: Record<string, string | Blob>;
}

export const ChatInterface = ({
  title,
  webhookUrl,
  initialMessage = "Hello! I'm your Interview Coach. How can I help you prepare for your interview today?",
  profile,
  extraFields
}: ChatInterfaceProps) => {
  console.log('ChatInterface received props:', { title, webhookUrl, profile });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial bot message
    setMessages([{
      id: '1',
      type: 'bot',
      content: initialMessage,
      timestamp: new Date()
    }]);
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      const requestData = {
        user_id: user?.id,
        input: currentInput,
        profile: profile,
      };

      console.log(`Making request to webhook: ${webhookUrl}`);
      console.log('Request data:', requestData);
      console.log('DEBUGGING - Actual webhook URL being used:', webhookUrl);
      
      // Use FormData for POST request
      const formData = new FormData();
      formData.append('user_id', user?.id || '');
      formData.append('input', currentInput);
      formData.append('profile', JSON.stringify(profile || {}));
      if (extraFields) {
        Object.entries(extraFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', webhookResponse.status);
      console.log('Response headers:', Object.fromEntries(webhookResponse.headers.entries()));

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

      // Extract the actual response content
      let botResponseContent = '';
      
      // Handle array responses (like [{"output": "..."}])
      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0];
        if (typeof firstItem === 'string') {
          botResponseContent = firstItem;
        } else if (firstItem.output) {
          botResponseContent = firstItem.output;
        } else if (firstItem.response) {
          botResponseContent = firstItem.response;
        } else if (firstItem.content) {
          botResponseContent = firstItem.content;
        } else if (firstItem.message) {
          botResponseContent = firstItem.message;
        } else if (firstItem.text) {
          botResponseContent = firstItem.text;
        } else {
          botResponseContent = JSON.stringify(firstItem, null, 2);
        }
      } else if (typeof responseData === 'string') {
        botResponseContent = responseData;
      } else if (responseData.output) {
        botResponseContent = responseData.output;
      } else if (responseData.response) {
        botResponseContent = responseData.response;
      } else if (responseData.content) {
        botResponseContent = responseData.content;
      } else if (responseData.message) {
        botResponseContent = responseData.message;
      } else if (responseData.text) {
        botResponseContent = responseData.text;
      } else {
        botResponseContent = JSON.stringify(responseData, null, 2);
      }

      console.log('Final bot response content:', botResponseContent);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Save to agent logs
      await supabase
        .from('agent_logs')
        .insert({
          user_id: user?.id,
          agent_name: title,
          input_data: requestData,
          response_data: responseData,
        });

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorContent = `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`;
      
      // Check for CORS-related errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorContent = 'Connection error: Unable to reach the interview coach service. This might be a temporary network issue or CORS configuration problem. Please try again.';
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {title}
        </h2>
      </div>

      <Card className="flex-1 rounded-none border-x border-b-0">
        <CardContent className="h-full p-0">
          <div className="h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
