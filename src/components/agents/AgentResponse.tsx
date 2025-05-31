
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText } from 'lucide-react';

interface AgentResponseProps {
  response: any;
}

export const AgentResponse = ({ response }: AgentResponseProps) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  
  if (!response) return null;

  // Function to detect if a string contains markdown
  const containsMarkdown = (text: string) => {
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#+\s+.+$/m,  // Headers
      /\*\*.+\*\*/,   // Bold
      /\*.+\*/,       // Italic
      /\[.+\]\(.+\)/, // Links
      /```[\s\S]+```/, // Code blocks
      /^\s*[-*+]\s+.+/m, // Lists
      /^\s*\d+\.\s+.+/m, // Numbered lists
      /^\s*>\s+.+/m,   // Blockquotes
    ];
    
    return typeof text === 'string' && markdownPatterns.some(pattern => pattern.test(text));
  };

  // Function to format the response
  const formatResponse = () => {
    if (!response) return '';
    
    // If response is a string
    if (typeof response === 'string') {
      return response;
    }
    
    // If response has a specific content field (common in API responses)
    if (response.content) {
      return response.content;
    }
    
    // If response has a message field
    if (response.message) {
      return response.message;
    }
    
    // If response has a text field
    if (response.text) {
      return response.text;
    }
    
    // If response has a data field
    if (response.data) {
      if (typeof response.data === 'string') {
        return response.data;
      }
      return JSON.stringify(response.data, null, 2);
    }
    
    // Default to JSON string
    return JSON.stringify(response, null, 2);
  };

  const formattedContent = formatResponse();
  const isMarkdown = containsMarkdown(formattedContent);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Response</label>
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'formatted' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('formatted')}
          >
            <FileText className="h-4 w-4 mr-1" />
            Formatted
          </Button>
          <Button 
            variant={viewMode === 'raw' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('raw')}
          >
            <Code className="h-4 w-4 mr-1" />
            Raw
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {viewMode === 'formatted' ? (
          <div className="p-4 bg-white max-h-[500px] overflow-auto">
            {isMarkdown ? (
              <div className="prose prose-sm max-w-none">
                {formattedContent}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm">
                {formattedContent}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 max-h-[500px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
