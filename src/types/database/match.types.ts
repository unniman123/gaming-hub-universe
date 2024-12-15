import { BaseMatch } from './base.types';

export interface Match extends BaseMatch {
  id: string;
  created_at: string;
  updated_at: string;
}

export type MatchInsert = Omit<Match, 'id' | 'created_at' | 'updated_at'>;
export type MatchUpdate = Partial<Match>;