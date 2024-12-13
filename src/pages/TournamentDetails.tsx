import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Loader2, Swords } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  // Redirect to login if no session
  React.useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const { data: tournament, isLoading: tournamentLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_participants (
            player_id,
            status,
            profiles (
              username,
              avatar_url,
              skill_rating
            )
          ),
          matches (
            *,
            player1:profiles!matches_player1_id_fkey (username),
            player2:profiles!matches_player2_id_fkey (username),
            winner:profiles!matches_winner_id_fkey (username)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!session,
  });

  if (!session) {
    return null; // Will redirect in useEffect
  }

  if (tournamentLoading) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gaming-accent" />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <h1 className="text-2xl text-white">Tournament not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-gaming-accent" />
            {tournament?.title}
          </h1>
          <p className="text-gray-400 mt-2">{tournament?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gaming-dark/50 border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="text-gaming-accent" />
                Prize Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gaming-accent">
                ${tournament?.prize_pool}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark/50 border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="text-gaming-accent" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {tournament?.tournament_participants?.length}/{tournament?.max_participants}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gaming-dark/50 border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="text-gaming-accent" />
                Start Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {format(new Date(tournament?.start_date), 'MMM dd, yyyy')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-gaming-accent" />
            Participants
          </h2>
          <div className="bg-gaming-dark/50 rounded-lg border border-gaming-accent/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournament?.tournament_participants?.map((participant: any) => (
                <Card key={participant.player_id} className="bg-gaming-dark/50 border-gaming-accent/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-white font-medium">{participant.profiles.username}</p>
                        <Badge variant="outline" className="mt-1">
                          {participant.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;