
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const UploadResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `resumes/${user.id}/resume.pdf`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      const resumeUrl = urlData.publicUrl;

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          resume_url: resumeUrl,
        });

      if (updateError) throw updateError;

      // Call verify-profile webhook
      const webhookResponse = await fetch('https://n8n.erudites.in/webhook-test/verify-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          resume_url: resumeUrl,
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error('Failed to trigger profile verification');
      }

      toast({
        title: "Success",
        description: "Resume uploaded and parsing started.",
      });

      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="resume-upload" className="block text-sm font-medium mb-2">
              Select PDF Resume
            </label>
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Selected file: {file.name}
              </p>
              <p className="text-sm text-gray-600">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </Button>

          <div className="text-sm text-gray-500">
            <p>• Only PDF files are supported</p>
            <p>• Your resume will be automatically parsed to extract profile information</p>
            <p>• The parsing results will update your profile data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadResume;
