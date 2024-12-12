import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ScoreSubmissionProps {
  matchId: string;
  player1Id: string;
  player2Id: string;
  isParticipant: boolean;
  currentStatus: string;
}

const ScoreSubmission = ({ 
  matchId, 
  player1Id, 
  player2Id,
  isParticipant,
  currentStatus 
}: ScoreSubmissionProps) => {
  const [score1, setScore1] = useState<string>('');
  const [score2, setScore2] = useState<string>('');
  const { session } = useSessionContext();
  const queryClient = useQueryClient();

  const submitScore = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('Not authenticated');
      
      const score1Num = parseInt(score1);
      const score2Num = parseInt(score2);
      
      if (isNaN(score1Num) || isNaN(score2Num)) {
        throw new Error('Invalid scores');
      }

      const winnerId = score1Num > score2Num ? player1Id : player2Id;

      const { error } = await supabase
        .from('matches')
        .update({
          score_player1: score1Num,
          score_player2: score2Num,
          winner_id: winnerId,
          status: 'completed'
        })
        .eq('id', matchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
      toast.success('Scores submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit scores');
      console.error('Error submitting scores:', error);
    }
  });

  if (!isParticipant || currentStatus === 'completed') {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-gaming-dark/50 rounded-lg border border-gaming-accent/20">
      <h3 className="text-lg font-semibold text-white">Submit Scores</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Player 1 Score</label>
          <Input
            type="number"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
            className="bg-gaming-dark/50 border-gaming-accent/20"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Player 2 Score</label>
          <Input
            type="number"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
            className="bg-gaming-dark/50 border-gaming-accent/20"
          />
        </div>
      </div>
      <Button
        onClick={() => submitScore.mutate()}
        disabled={submitScore.isPending || !score1 || !score2}
        className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
      >
        Submit Scores
      </Button>
    </div>
  );
};

export default ScoreSubmission;