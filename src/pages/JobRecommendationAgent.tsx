
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const JobRecommendationAgent = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, message: string}[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Placeholder for sending message to agent
  const sendMessage = () => {
    setChatHistory([...chatHistory, {role: "user", message: chatInput}]);
    setChatInput("");
    // TODO: Connect to AI agent
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Recommendation Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Search relevant jobs..." 
                value={search}
                onChange={e => setSearch(e.target.value)} 
                className="w-1/2"
              />
              <Input 
                placeholder="Filter (location, role...)" 
                value={filter}
                onChange={e => setFilter(e.target.value)} 
                className="w-1/2"
              />
              <Button>Apply</Button>
            </div>
            <div className="border rounded bg-gray-50 p-4 max-h-60 overflow-auto mb-2">
              {chatHistory.length === 0
                ? <div className="text-gray-500">Start a chat to get job recommendations.</div>
                : chatHistory.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                    <span className={`inline-block px-2 rounded ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"} mb-1`}>
                      {msg.message}
                    </span>
                  </div>
                ))
              }
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your query about jobs..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {if (e.key === "Enter") sendMessage();}}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRecommendationAgent;
