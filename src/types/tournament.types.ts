export interface Tournament {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  game_type: string;
  max_participants: number;
  start_date: string;
  end_date?: string;
  status?: string;
  prize_pool?: number;
  created_at: string;
  updated_at: string;
  match_time_limit?: unknown;
  tournament_rules?: string;
  dispute_resolution_rules?: string;
  prize_distributed?: boolean;
  deleted_at?: string;
}

export interface TournamentInsert extends Partial<Omit<Tournament, 'id' | 'created_at' | 'updated_at'>> {
  creator_id: string;
  title: string;
  game_type: string;
  max_participants: number;
  start_date: string;
}

export interface TournamentUpdate extends Partial<Tournament> {}