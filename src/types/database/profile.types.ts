export interface Profile {
  id: string;
  username: string;
  avatar_url?: string | null;
  gaming_experience?: string | null;
  created_at: string;
  updated_at: string;
  skill_rating: number;
  is_in_matchmaking?: boolean | null;
  is_admin?: boolean | null;
  is_online?: boolean | null;
  last_seen?: string | null;
  game_id?: string | null;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Profile>;