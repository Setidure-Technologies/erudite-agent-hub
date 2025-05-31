
interface AgentResponseProps {
  response: any;
}

export const AgentResponse = ({ response }: AgentResponseProps) => {
  if (!response) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Response</label>
      <div className="p-4 bg-gray-50 rounded-md max-h-96 overflow-auto">
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
};
