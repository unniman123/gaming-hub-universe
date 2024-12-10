import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Users, User, LogOut, Shield } from "lucide-react";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const { data: userProfile } = useQuery({
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
    enabled: !!session?.user?.id,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Error logging out");
    }
  };
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-gaming-dark/80 backdrop-blur-md border-b border-gaming-accent/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-gaming-accent to-gaming-primary bg-clip-text text-transparent">
              GamersHub
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/tournaments" 
                className={`flex items-center gap-2 text-gray-300 hover:text-gaming-accent transition-colors ${
                  location.pathname === '/tournaments' ? 'text-gaming-accent' : ''
                }`}
              >
                <Trophy size={18} />
                Tournaments
              </Link>
              <Link 
                to="/matchmaking" 
                className={`flex items-center gap-2 text-gray-300 hover:text-gaming-accent transition-colors ${
                  location.pathname === '/matchmaking' ? 'text-gaming-accent' : ''
                }`}
              >
                <Users size={18} />
                Matchmaking
              </Link>
              {userProfile?.is_admin && (
                <Link 
                  to="/admin/tournaments" 
                  className={`flex items-center gap-2 text-gray-300 hover:text-gaming-accent transition-colors ${
                    location.pathname.startsWith('/admin') ? 'text-gaming-accent' : ''
                  }`}
                >
                  <Shield size={18} />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="text-gray-300 hover:text-gaming-accent">
                    <User size={18} className="mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-gaming-accent"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;