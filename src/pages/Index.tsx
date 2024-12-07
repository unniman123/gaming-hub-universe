import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { LayoutDashboard, Trophy, History, ChartBar, Users } from "lucide-react";
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { session } = useSessionContext();

  // Fetch user's match history
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          player1:profiles!matches_player1_id_fkey(username),
          player2:profiles!matches_player2_id_fkey(username)
        `)
        .or(`player1_id.eq.${session?.user?.id},player2_id.eq.${session?.user?.id}`)
        .order('match_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('skill_rating')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-gaming-accent" />
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Welcome to your gaming hub</p>
        </div>

        {/* Stats Grid */}
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
                {matchesLoading ? "Loading..." : matches?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match History */}
        <Card className="bg-gaming-dark/50 border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="text-gaming-accent" />
              Recent Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matchesLoading ? (
              <div className="text-center py-4">Loading matches...</div>
            ) : matches?.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No matches found</div>
            ) : (
              <div className="space-y-4">
                {matches?.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gaming-dark/30 border border-gaming-accent/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {match.player1.username} vs {match.player2.username}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {match.score_player1} - {match.score_player2}
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${
                        match.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {match.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;