import { useState } from 'react';
import { Button } from '@/components/ui/button';

const TestWebhook = () => {
  const [result, setResult] = useState('');

  const testWebhook = async () => {
    const testUrl = "https://n8n.erudites.in/webhook-test/interview-coach";
    console.log('Testing webhook URL:', testUrl);
    
    try {
      const formData = new FormData();
      formData.append('user_id', 'test-user');
      formData.append('input', 'test message');
      formData.append('profile', JSON.stringify({}));

      const response = await fetch(testUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      
      const text = await response.text();
      setResult(`Status: ${response.status}, URL: ${response.url}, Response: ${text}`);
    } catch (error) {
      console.error('Error:', error);
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Webhook Test</h1>
      <Button onClick={testWebhook} className="mb-4">
        Test Webhook
      </Button>
      <div className="bg-gray-100 p-4 rounded">
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default TestWebhook;