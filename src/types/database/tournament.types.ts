import { BaseTournament } from './base.types';

export interface Tournament extends BaseTournament {
  id: string;
  created_at: string;
  updated_at: string;
}

export type TournamentInsert = Omit<Tournament, 'id' | 'created_at' | 'updated_at'>;
export type TournamentUpdate = Partial<Tournament>;