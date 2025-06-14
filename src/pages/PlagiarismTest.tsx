
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const PlagiarismTest = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | string>(null);

  // Placeholder for demo only
  const checkPlagiarism = () => {
    if (!text.trim()) return setResult("Please input text to check.");
    setResult("Plagiarism detection coming soon (AI-powered integration planned)!");
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plagiarism Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="w-full min-h-[160px]"
            placeholder="Paste your work here to check for plagiarism..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <Button onClick={checkPlagiarism} className="mt-2">Check</Button>
          {result && (
            <div className="mt-4 text-blue-700">{result}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlagiarismTest;
