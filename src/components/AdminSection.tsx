import React from 'react';
import { Shield, Users, Trophy } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Shield className="text-gaming-accent" />
        Admin Controls
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gaming-accent" />
              Tournament Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Create and manage tournaments</p>
            <Button 
              onClick={() => navigate('/admin/tournaments')}
              className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
            >
              Manage Tournaments
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-gaming-accent" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">Manage user accounts and roles</p>
            <Button 
              onClick={() => navigate('/admin/users')}
              className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
            >
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSection;