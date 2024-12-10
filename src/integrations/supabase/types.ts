import { Database } from './database.types';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Profile = Tables<'profiles'> & {
  skill_rating: number;
  username: string;
};

export type Tournament = Tables<'tournaments'> & {
  match_time_limit?: string;
  tournament_rules?: string;
  dispute_resolution_rules?: string;
};

export type Match = Tables<'matches'> & {
  player1?: Profile;
  player2?: Profile;
  tournaments?: Tournament;
};

export type DisputeCase = Tables<'dispute_cases'>;
export type DisputeMessage = Tables<'dispute_messages'>;
export type MatchChat = Tables<'match_chat'>;
export type DirectMessage = Tables<'direct_messages'>;
export type TournamentParticipant = Tables<'tournament_participants'>;