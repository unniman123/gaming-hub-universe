import React from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gaming-dark/80 backdrop-blur-md border-b border-gaming-accent/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gaming-accent to-gaming-primary bg-clip-text text-transparent">
              GamersHub
            </h1>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-gaming-accent transition-colors">
                Tournaments
              </a>
              <a href="#" className="text-gray-300 hover:text-gaming-accent transition-colors">
                Games
              </a>
              <a href="#" className="text-gray-300 hover:text-gaming-accent transition-colors">
                Leaderboard
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-gaming-accent">
              Sign In
            </Button>
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