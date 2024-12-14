export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  gaming_experience?: string;
  created_at: string;
  updated_at: string;
  skill_rating?: number;
  is_in_matchmaking?: boolean;
  is_admin?: boolean;
  is_online?: boolean;
  last_seen?: string;
  game_id?: string;
}