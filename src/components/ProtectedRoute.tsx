
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // Log auth state for debugging
  useEffect(() => {
    console.log('ProtectedRoute auth state:', { user: user ? 'Authenticated' : 'Not authenticated', isLoading });
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('User authenticated, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;
