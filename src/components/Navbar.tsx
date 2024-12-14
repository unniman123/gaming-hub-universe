import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Trophy, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gaming-dark/95 backdrop-blur-sm border-b border-gaming-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-gaming-accent" />
            <span className="text-xl font-bold text-white">HomeGround</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link to="/tournaments">
                  <Button variant="ghost">Tournaments</Button>
                </Link>
                <Link to="/matchmaking">
                  <Button variant="ghost">Matchmaking</Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;