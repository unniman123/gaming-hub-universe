import { supabase } from "@/integrations/supabase/client";

export const generateTournamentMatches = async (tournamentId: string) => {
  try {
    // Get all participants
    const { data: participants } = await supabase
      .from('tournament_participants')
      .select('player_id')
      .eq('tournament_id', tournamentId)
      .eq('status', 'registered');

    if (!participants) return;

    // Shuffle participants randomly
    const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
    
    // Create matches for round 1
    for (let i = 0; i < shuffledParticipants.length - 1; i += 2) {
      const player1 = shuffledParticipants[i];
      const player2 = shuffledParticipants[i + 1];
      
      if (player1 && player2) {
        await supabase
          .from('matches')
          .insert({
            tournament_id: tournamentId,
            player1_id: player1.player_id,
            player2_id: player2.player_id,
            round: 1,
            match_date: new Date().toISOString(),
            status: 'pending'
          });
      }
    }

    // Update tournament status
    await supabase
      .from('tournaments')
      .update({ status: 'ongoing' })
      .eq('id', tournamentId);

  } catch (error) {
    console.error('Error generating tournament matches:', error);
    throw error;
  }
};

export const distributePrizes = async (tournamentId: string) => {
  try {
    // Get tournament details and prize tiers
    const { data: tournament } = await supabase
      .from('tournaments')
      .select(`
        *,
        prize_tiers (
          position,
          percentage
        ),
        tournament_participants (
          player_id,
          wins,
          losses,
          points
        )
      `)
      .eq('id', tournamentId)
      .single();

    if (!tournament || tournament.prize_distributed) return;

    // Sort participants by points/wins
    const sortedParticipants = tournament.tournament_participants.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });

    // Distribute prizes according to tiers
    for (const tier of tournament.prize_tiers) {
      const participant = sortedParticipants[tier.position - 1];
      if (participant) {
        const prizeAmount = (tournament.prize_pool * tier.percentage) / 100;
        console.log(`Prize of ${prizeAmount} distributed to player ${participant.player_id}`);
        // Here you would integrate with a payment system
      }
    }

    // Mark tournament as distributed
    await supabase
      .from('tournaments')
      .update({ prize_distributed: true })
      .eq('id', tournamentId);

  } catch (error) {
    console.error('Error distributing prizes:', error);
    throw error;
  }
};