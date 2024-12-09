import { Navigate } from "react-router-dom";
import { useSessionContext } from '@supabase/auth-helpers-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { session } = useSessionContext();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;