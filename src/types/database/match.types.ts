export interface Match {
  id: string;
  tournament_id?: string | null;
  player1_id: string;
  player2_id: string;
  winner_id?: string | null;
  score_player1?: number | null;
  score_player2?: number | null;
  match_date: string;
  created_at: string;
  updated_at: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | null;
  game_mode?: string | null;
  round?: number | null;
}

export type MatchInsert = Omit<Match, 'id' | 'created_at' | 'updated_at'>;
export type MatchUpdate = Partial<Match>;