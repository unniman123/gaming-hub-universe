import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
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
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="ghost" className="text-gray-300 hover:text-gaming-accent">
                <User size={18} className="mr-2" />
                Profile
              </Button>
            </Link>
            <Button className="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark">
              Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;