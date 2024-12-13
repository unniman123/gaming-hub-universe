import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

const Tournaments = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: tournaments, isLoading: tournamentsLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_participants (
            player_id,
            status
          )
        `)
        .eq('status', 'upcoming') // Only show upcoming tournaments
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: userParticipations } = useQuery({
    queryKey: ['user-tournament-participations', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('player_id', session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const joinTournament = async (tournamentId: string) => {
    try {
      // Check if tournament is full
      const tournament = tournaments?.find(t => t.id === tournamentId);
      if (!tournament) {
        throw new Error('Tournament not found');
      }

      if (getParticipantCount(tournament) >= tournament.max_participants) {
        throw new Error('Tournament is full');
      }

      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          player_id: session?.user?.id,
          status: 'registered'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have successfully joined the tournament!",
      });

      // Navigate to tournament details page after joining
      navigate(`/tournaments/${tournamentId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (tournamentsLoading) {
    return (
      <div className="min-h-screen bg-gaming-dark">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gaming-accent" />
        </div>
      </div>
    );
  }

  const isUserParticipating = (tournamentId: string) => {
    return userParticipations?.some(p => p.tournament_id === tournamentId);
  };

  const getParticipantCount = (tournament: any) => {
    return tournament.tournament_participants?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gaming-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
          <Trophy className="text-gaming-accent" />
          Tournaments
        </h1>
        <div className="bg-gaming-dark/50 rounded-lg border border-gaming-accent/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Tournament</TableHead>
                <TableHead className="text-gray-300">Game</TableHead>
                <TableHead className="text-gray-300">Prize Pool</TableHead>
                <TableHead className="text-gray-300">Players</TableHead>
                <TableHead className="text-gray-300">Start Date</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments?.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <Trophy className="text-gaming-accent" />
                      {tournament.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{tournament.game_type}</TableCell>
                  <TableCell className="text-gaming-accent">
                    ${tournament.prize_pool}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {getParticipantCount(tournament)}/{tournament.max_participants}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {format(new Date(tournament.start_date), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isUserParticipating(tournament.id) ? (
                      <Button 
                        variant="secondary"
                        className="w-full"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="default"
                        className="w-full"
                        onClick={() => joinTournament(tournament.id)}
                        disabled={getParticipantCount(tournament) >= tournament.max_participants}
                      >
                        Join Tournament
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;