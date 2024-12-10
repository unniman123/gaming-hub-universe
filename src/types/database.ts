import { Database } from "@/integrations/supabase/database.types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type TournamentParticipant = Database['public']['Tables']['tournament_participants']['Row'];