import { Match } from '@/types/match.types';
import { Profile } from '@/types/profile.types';
import { Tournament, TournamentInsert, TournamentUpdate } from '@/types/tournament.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: Tournament;
        Insert: TournamentInsert;
        Update: TournamentUpdate;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Profile>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Match>;
      };
      direct_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dispute_cases: {
        Row: {
          against_id: string
          created_at: string | null
          description: string
          id: string
          match_id: string
          reported_by_id: string
          resolution: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          against_id: string
          created_at?: string | null
          description: string
          id?: string
          match_id: string
          reported_by_id: string
          resolution?: string | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          against_id?: string
          created_at?: string | null
          description?: string
          id?: string
          match_id?: string
          reported_by_id?: string
          resolution?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_cases_against_id_fkey"
            columns: ["against_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_cases_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_cases_reported_by_id_fkey"
            columns: ["reported_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dispute_messages: {
        Row: {
          created_at: string | null
          dispute_id: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          dispute_id: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          dispute_id?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "dispute_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      match_chat: {
        Row: {
          created_at: string | null
          id: string
          is_system_message: boolean | null
          match_id: string | null
          message: string
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_system_message?: boolean | null
          match_id?: string | null
          message: string
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_system_message?: boolean | null
          match_id?: string | null
          message?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_chat_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_chat_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      matches: {
        Row: {
          created_at: string
          game_mode: string | null
          id: string
          match_date: string
          player1_id: string
          player2_id: string
          score_player1: number | null
          score_player2: number | null
          status: Database["public"]["Enums"]["match_status"] | null
          tournament_id: string | null
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          game_mode?: string | null
          id?: string
          match_date: string
          player1_id: string
          player2_id: string
          score_player1?: number | null
          score_player2?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          game_mode?: string | null
          id?: string
          match_date?: string
          player1_id?: string
          player2_id?: string
          score_player1?: number | null
          score_player2?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          game_id: string | null
          gaming_experience: string | null
          id: string
          is_admin: boolean | null
          is_in_matchmaking: boolean | null
          is_online: boolean | null
          last_seen: string | null
          skill_rating: number | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          game_id?: string | null
          gaming_experience?: string | null
          id: string
          is_admin?: boolean | null
          is_in_matchmaking?: boolean | null
          is_online?: boolean | null
          last_seen?: string | null
          skill_rating?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          game_id?: string | null
          gaming_experience?: string | null
          id: string
          is_admin?: boolean | null
          is_in_matchmaking?: boolean | null
          is_online?: boolean | null
          last_seen?: string | null
          skill_rating?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          id: string
          player_id: string
          registration_date: string
          status: string | null
          tournament_id: string
        }
        Insert: {
          id?: string
          player_id: string
          registration_date?: string
          status?: string | null
          tournament_id: string
        }
        Update: {
          id?: string
          player_id?: string
          registration_date?: string
          status?: string | null
          tournament_id: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_match: {
        Args: { player1_id: string; player2_id: string };
        Returns: string;
      };
      find_match: {
        Args: { player_id: string };
        Returns: string;
      };
    };
    Enums: {
      match_status: "pending" | "in_progress" | "completed" | "cancelled";
    };
  };
}
