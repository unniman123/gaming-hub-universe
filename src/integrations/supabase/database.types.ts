import { Match, MatchInsert, MatchUpdate } from '@/types/database/match.types';
import { Profile, ProfileInsert, ProfileUpdate } from '@/types/database/profile.types';
import { Tournament, TournamentInsert, TournamentUpdate } from '@/types/database/tournament.types';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      matches: {
        Row: Match;
        Insert: MatchInsert;
        Update: MatchUpdate;
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
        ];
      };
      tournaments: {
        Row: Tournament;
        Insert: TournamentInsert;
        Update: TournamentUpdate;
        Relationships: [
          {
            foreignKeyName: "tournaments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ];
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
          admin_notes: string | null
          against_id: string
          created_at: string | null
          description: string
          id: string
          match_id: string
          reported_by_id: string
          resolution: string | null
          resolution_type: string | null
          status: Database["public"]["Enums"]["dispute_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          against_id: string
          created_at?: string | null
          description: string
          id?: string
          match_id: string
          reported_by_id: string
          resolution?: string | null
          resolution_type?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          against_id?: string
          created_at?: string | null
          description?: string
          id?: string
          match_id?: string
          reported_by_id?: string
          resolution?: string | null
          resolution_type?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
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
