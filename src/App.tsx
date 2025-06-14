
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthForm } from "./components/auth/AuthForm";
import { Layout } from "./components/layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import UploadResume from "./pages/UploadResume";
import AnalyzeSkillGap from "./pages/AnalyzeSkillGap";
import RecommendJobs from "./pages/RecommendJobs";
import InterviewCoach from "./pages/InterviewCoach";
import TestWebhook from "./pages/TestWebhook";
import AdminPanel from "./pages/AdminPanel";
import VoiceTraining from "./pages/VoiceTraining";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show routes for both authenticated and non-authenticated users
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthForm />} />
        
        {/* Protected routes - only show when user is authenticated */}
        {user && (
          <>
            <Route path="/student-dashboard" element={<Layout><StudentDashboard /></Layout>} />
            <Route path="/teacher-dashboard" element={<Layout><TeacherDashboard /></Layout>} />
            <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/upload-resume" element={<Layout><UploadResume /></Layout>} />
            <Route path="/analyze-skill-gap" element={<Layout><AnalyzeSkillGap /></Layout>} />
            <Route path="/recommend-jobs" element={<Layout><RecommendJobs /></Layout>} />
            <Route path="/interview-coach" element={<Layout><InterviewCoach /></Layout>} />
            <Route path="/test-webhook" element={<Layout><TestWebhook /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
            <Route path="/voice-training" element={<Layout><VoiceTraining /></Layout>} />
            <Route path="/job-recommendation" element={<Layout><JobRecommendationAgent /></Layout>} />
            <Route path="/course-recommendation" element={<Layout><CertificateCourseAgent /></Layout>} />
            <Route path="/resume-maker" element={<Layout><ResumeMaker /></Layout>} />
            <Route path="/plagiarism-test" element={<Layout><PlagiarismTest /></Layout>} />
          </>
        )}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
