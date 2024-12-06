import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Users, Gamepad } from "lucide-react";

const Matchmaking = () => {
  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Quick Match</h1>
          <div className="bg-gaming-dark/50 border border-gaming-accent/20 rounded-lg p-8 mb-8">
            <Gamepad className="w-16 h-16 mx-auto mb-4 text-gaming-accent" />
            <p className="text-gray-300 mb-6">
              Find players of similar skill level and jump into a match instantly
            </p>
            <Button className="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark">
              <Users className="mr-2" />
              Find Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;