export interface Match {
  id: string;
  tournament_id?: string;
  player1_id: string;
  player2_id: string;
  winner_id?: string;
  score_player1?: number;
  score_player2?: number;
  match_date: string;
  created_at: string;
  updated_at: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  game_mode?: string;
  round?: number;
}