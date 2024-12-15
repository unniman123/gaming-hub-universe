import { BaseProfile } from './base.types';

export interface Profile extends BaseProfile {
  id: string;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Profile>;