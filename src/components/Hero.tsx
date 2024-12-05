import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gaming-dark overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary/20 via-gaming-dark to-gaming-secondary/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gaming-accent/30 rounded-full filter blur-3xl animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gaming-primary/30 rounded-full filter blur-3xl animate-glow" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gaming-accent via-white to-gaming-accent bg-clip-text text-transparent">
          Level Up Your Gaming Experience
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join competitive tournaments, win prizes, and become a legend in the gaming community.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button className="bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark text-lg px-8 py-6">
            Join Tournament
          </Button>
          <Button variant="outline" className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent/10 text-lg px-8 py-6">
            Browse Games
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;