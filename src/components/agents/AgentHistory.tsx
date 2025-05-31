
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AgentHistoryProps {
  agentLogs: any[];
}

export const AgentHistory = ({ agentLogs }: AgentHistoryProps) => {
  if (agentLogs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Executions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agentLogs.map((log) => (
            <div key={log.id} className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-500">
                {new Date(log.created_at).toLocaleString()}
              </div>
              <div className="text-sm">
                <strong>Input:</strong> {JSON.stringify(log.input_data?.input || log.input_data, null, 2).slice(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
