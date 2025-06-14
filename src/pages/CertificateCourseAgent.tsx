
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CertificateCourseAgent = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, message: string}[]>([]);

  const sendMessage = () => {
    setChatHistory([...chatHistory, {role: "user", message: chatInput}]);
    setChatInput("");
    // TODO: Connect to AI agent
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Certificate / Course Recommendation Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded bg-gray-50 p-4 max-h-60 overflow-auto mb-2">
            {chatHistory.length === 0
              ? <div className="text-gray-500">Start a chat to get course recommendations.</div>
              : chatHistory.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                  <span className={`inline-block px-2 rounded ${msg.role === "user" ? "bg-green-200" : "bg-gray-200"} mb-1`}>
                    {msg.message}
                  </span>
                </div>
              ))
            }
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Type your query about courses..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => {if (e.key === "Enter") sendMessage();}}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateCourseAgent;
