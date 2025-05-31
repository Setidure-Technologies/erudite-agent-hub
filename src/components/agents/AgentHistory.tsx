
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface AgentHistoryProps {
  agentLogs: any[];
  onSelectInput?: (input: string) => void;
}

export const AgentHistory = ({ agentLogs, onSelectInput }: AgentHistoryProps) => {
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  if (agentLogs.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedLog(expandedLog === id ? null : id);
  };

  const handleReuseInput = (input: string) => {
    if (onSelectInput) {
      onSelectInput(input);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getInputText = (log: any) => {
    if (log.input_data?.input) {
      return log.input_data.input;
    } else if (typeof log.input_data === 'string') {
      return log.input_data;
    } else {
      return JSON.stringify(log.input_data, null, 2);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agentLogs.map((log) => (
            <Collapsible 
              key={log.id} 
              open={expandedLog === log.id}
              onOpenChange={() => toggleExpand(log.id)}
              className="border rounded-md p-2 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">
                    {formatDate(log.created_at)}
                  </div>
                  <div className="text-sm font-medium line-clamp-1">
                    {getInputText(log).slice(0, 100)}
                    {getInputText(log).length > 100 ? '...' : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReuseInput(getInputText(log));
                    }}
                    title="Reuse this input"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {expandedLog === log.id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              
              <CollapsibleContent className="mt-2">
                <div className="space-y-2">
                  <div className="bg-gray-100 p-3 rounded-md">
                    <div className="text-xs font-medium mb-1">Input:</div>
                    <div className="text-sm whitespace-pre-wrap">
                      {getInputText(log)}
                    </div>
                  </div>
                  
                  {log.response_data && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="text-xs font-medium mb-1">Response:</div>
                      <div className="text-sm whitespace-pre-wrap">
                        {typeof log.response_data === 'string' 
                          ? log.response_data 
                          : JSON.stringify(log.response_data, null, 2)
                        }
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
