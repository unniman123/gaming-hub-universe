import React from 'react';
import { ChartBar, Users, Trophy, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsGridProps {
  userStats?: { skill_rating: number };
  statsLoading: boolean;
  matchesCount: number;
  matchesLoading: boolean;
}

const StatsGrid = ({ userStats, statsLoading, matchesCount, matchesLoading }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gaming-dark/50 border-gaming-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skill Rating</CardTitle>
          <ChartBar className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statsLoading ? "Loading..." : userStats?.skill_rating || 1000}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gaming-dark/50 border-gaming-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Players</CardTitle>
          <Users className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245</div>
        </CardContent>
      </Card>

      <Card className="bg-gaming-dark/50 border-gaming-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
          <Trophy className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
        </CardContent>
      </Card>

      <Card className="bg-gaming-dark/50 border-gaming-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          <History className="h-4 w-4 text-gaming-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {matchesLoading ? "Loading..." : matchesCount || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;