export interface Tournament {
  id: string;
  creator_id: string;
  title: string;
  description?: string | null;
  game_type: string;
  max_participants: number;
  start_date: string;
  end_date?: string | null;
  status?: string | null;
  prize_pool?: number | null;
  created_at: string;
  updated_at: string;
  match_time_limit?: unknown | null;
  tournament_rules?: string | null;
  dispute_resolution_rules?: string | null;
  prize_distributed?: boolean | null;
  deleted_at?: string | null;
}

export type TournamentInsert = Omit<Tournament, 'id' | 'created_at' | 'updated_at'>;
export type TournamentUpdate = Partial<Tournament>;