
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Dummy sample formats
const sampleFormats = [
  { name: "Classic", value: "# Classic Resume\n\n## Jane Doe\n\n- Email: jane@example.com\n- ...etc\n"},
  { name: "Modern", value: "# Modern Resume\n\n**Jane Doe**\n_Developer_\n..." }
];

const ResumeMaker = () => {
  const [markdown, setMarkdown] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(sampleFormats[0].value);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resume.md";
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Resume Maker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Sample Format</label>
              <select
                className="border px-2 py-1 rounded"
                value={selectedFormat}
                onChange={e => {
                  setSelectedFormat(e.target.value);
                  setMarkdown(e.target.value);
                }}>
                {sampleFormats.map(f => (
                  <option key={f.name} value={f.value}>{f.name}</option>
                ))}
              </select>
            </div>
            <Textarea
              className="w-full font-mono min-h-[240px]"
              placeholder="Write or paste your resume in markdown..."
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
            />
            <Button onClick={handleDownload}>Download Markdown</Button>
          </div>
          <div className="py-4 text-xs text-gray-500">
            AI-powered markdown resume builder coming soon. This is a preview and demo. Integration with n8n AI flows, automatic parsing, and direct download options (PDF, DOCX, etc.) coming in the next step!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeMaker;
