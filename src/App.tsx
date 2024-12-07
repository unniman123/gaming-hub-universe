import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import Matchmaking from "./pages/Matchmaking";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import TournamentManagement from "./pages/admin/TournamentManagement";
import UserManagement from "./pages/admin/UserManagement";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={
                  session ? <Index /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/tournaments" 
                element={
                  session ? <Tournaments /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/matchmaking" 
                element={
                  session ? <Matchmaking /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  session ? <Profile /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/admin/tournaments" 
                element={
                  session ? <TournamentManagement /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  session ? <UserManagement /> : <Navigate to="/login" replace />
                } 
              />
              <Route path="/login" element={<Auth />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;