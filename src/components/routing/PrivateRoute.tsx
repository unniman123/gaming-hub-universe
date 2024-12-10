import { Navigate } from "react-router-dom";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
  const { session } = useSessionContext();
  
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && adminOnly,
  });

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!userProfile?.is_admin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;