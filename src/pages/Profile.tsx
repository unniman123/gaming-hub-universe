import React from 'react';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, User } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gaming-dark/50 border border-gaming-accent/20 rounded-lg p-8">
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">ProGamer123</h1>
                <p className="text-gray-300">Member since March 2024</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gaming-dark/30 p-4 rounded-lg border border-gaming-accent/10">
                <Trophy className="text-gaming-accent mb-2" />
                <h3 className="text-white font-semibold">Tournaments Won</h3>
                <p className="text-2xl text-gaming-accent">12</p>
              </div>
              {/* Add more stats cards here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;