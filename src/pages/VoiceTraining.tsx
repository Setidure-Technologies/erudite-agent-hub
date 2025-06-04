
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mic, Square, Play, Volume2, MessageSquare } from 'lucide-react';
import { getScoreBadgeVariant } from '@/lib/getScoreBadgeVariant';

export const getScoreBadgeVariant = (score: number | null | undefined) => {
  if (score === null || score === undefined) return "secondary";
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
};

const VoiceTraining = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sampleQuestions = [
    "Tell me about yourself and your career goals.",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "Where do you see yourself in five years?",
    "Why are you interested in this position and our company?",
    "How do you handle stress and pressure in the workplace?",
    "Give an example of when you demonstrated leadership skills.",
    "What motivates you in your professional life?",
    "Describe a time when you had to work with a difficult team member.",
    "How do you stay updated with industry trends and developments?"
  ];

  useEffect(() => {
    if (user) {
      fetchSessions();
      generateRandomQuestion();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('vaakshakti_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const generateRandomQuestion = () => {
    const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    setCurrentQuestion(randomQuestion);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const saveSession = async () => {
    if (!audioBlob || !currentQuestion) {
      toast({
        title: "Error",
        description: "Please record an answer first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For now, we'll save the session without actual audio upload
      // In a real implementation, you'd upload the audio to storage first
      const { data, error } = await supabase
        .from('vaakshakti_sessions')
        .insert({
          user_id: user?.id,
          question: currentQuestion,
          transcript: transcript,
          duration_seconds: recordingTime,
          // audio_url would be set after uploading to storage
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session saved successfully!",
      });

      // Reset form
      setAudioBlob(null);
      setTranscript('');
      setRecordingTime(0);
      generateRandomQuestion();
      fetchSessions();

    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: "Failed to save session.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Volume2 className="h-6 w-6" />
        <h1 className="text-3xl font-bold">VaakShakti - Voice Training</h1>
      </div>

      {/* Recording Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Practice Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Question:
            </h3>
            <p className="text-lg">{currentQuestion}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateRandomQuestion}
              className="mt-3"
            >
              New Question
            </Button>
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg" className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" size="lg" className="flex items-center gap-2">
                  <Square className="h-5 w-5" />
                  Stop Recording
                </Button>
              )}

              {audioBlob && (
                <Button onClick={playRecording} variant="outline" size="lg" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Play Recording
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-red-600">
                  {formatTime(recordingTime)}
                </div>
                <div className="text-sm text-gray-500">Recording...</div>
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="text-center">
                <div className="text-lg font-medium">Recording completed!</div>
                <div className="text-sm text-gray-500">Duration: {formatTime(recordingTime)}</div>
              </div>
            )}
          </div>

          {/* Transcript Input */}
          {audioBlob && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Transcript (Optional - Add what you said):
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Type what you said in the recording..."
                className="w-full p-3 border rounded-lg"
                rows={4}
              />
            </div>
          )}

          {/* Save Button */}
          {audioBlob && (
            <Button 
              onClick={saveSession} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Saving...' : 'Save Session'}
            </Button>
          )}

          <audio ref={audioRef} style={{ display: 'none' }} />
        </CardContent>
      </Card>

      {/* Previous Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Practice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No practice sessions yet. Start your first session above!</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium">{session.question}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()} | 
                        Duration: {session.duration_seconds ? `${session.duration_seconds}s` : 'N/A'}
                      </div>
                    </div>
                    {session.fluency_score && (
                      <Badge variant={getScoreBadgeVariant(session.fluency_score)}>
                        Score: {session.fluency_score}%
                      </Badge>
                    )}
                  </div>
                  {session.transcript && (
                    <div className="text-sm bg-gray-50 p-2 rounded mt-2">
                      <strong>Transcript:</strong> {session.transcript}
                    </div>
                  )}
                  {session.grammar_feedback && (
                    <div className="text-sm bg-yellow-50 p-2 rounded mt-2">
                      <strong>Feedback:</strong> {session.grammar_feedback}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceTraining;
