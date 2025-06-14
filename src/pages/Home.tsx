
import { useAuth } from '@/hooks/useAuth';
import LandingPage from './LandingPage';
import AuthenticatedHome from './AuthenticatedHome';

const Home = () => {
  const { user } = useAuth();

  // Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show authenticated home for logged-in users
  return <AuthenticatedHome />;
};

export default Home;
