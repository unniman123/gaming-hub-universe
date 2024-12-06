import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, User } from "lucide-react";
import { RegisterForm } from './auth/RegisterForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement actual login logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast.success("Login successful!");
    setIsLoading(false);
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
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="ghost" className="text-gray-300 hover:text-gaming-accent">
                <User size={18} className="mr-2" />
                Profile
              </Button>
            </Link>
            
            {/* Login Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gaming-accent/20 text-gaming-accent hover:text-gaming-accent/90">
                  Login
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gaming-dark border-gaming-accent/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white">Login</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Enter your credentials to access your account
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="bg-gaming-dark/50 border-gaming-accent/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="bg-gaming-dark/50 border-gaming-accent/20 text-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gaming-accent hover:bg-gaming-accent/90 text-gaming-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <RegisterForm />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;