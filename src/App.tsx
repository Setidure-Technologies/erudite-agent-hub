
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthForm } from "./components/auth/AuthForm";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UploadResume from "./pages/UploadResume";
import VerifyProfile from "./pages/VerifyProfile";
import AnalyzeSkillGap from "./pages/AnalyzeSkillGap";
import RecommendJobs from "./pages/RecommendJobs";
import InterviewCoach from "./pages/InterviewCoach";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/verify-profile" element={<VerifyProfile />} />
        <Route path="/analyze-skill-gap" element={<AnalyzeSkillGap />} />
        <Route path="/recommend-jobs" element={<RecommendJobs />} />
        <Route path="/interview-coach" element={<InterviewCoach />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
