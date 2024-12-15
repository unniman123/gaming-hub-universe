import { Database as DatabaseGenerated } from './types';
import { DisputeStatus, MatchStatus } from '@/types/enums';
import { Profile, ProfileInsert, ProfileUpdate } from '@/types/database/profile.types';
import { Match, MatchInsert, MatchUpdate } from '@/types/database/match.types';
import { Tournament, TournamentInsert, TournamentUpdate } from '@/types/database/tournament.types';

export interface Database extends Omit<DatabaseGenerated, 'public'> {
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
          id: string;
          match_id: string;
          reported_by_id: string;
          against_id: string;
          title: string;
          description: string;
          resolution: string | null;
          created_at: string | null;
          updated_at: string | null;
          status: DisputeStatus | null;
          resolution_type: string | null;
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          reported_by_id: string;
          against_id: string;
          title: string;
          description: string;
          resolution?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          status?: DisputeStatus | null;
          resolution_type?: string | null;
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          reported_by_id?: string;
          against_id?: string;
          title?: string;
          description?: string;
          resolution?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          status?: DisputeStatus | null;
          resolution_type?: string | null;
          admin_notes?: string | null;
        };
      };
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
    Enums: {
      dispute_status: DisputeStatus;
      match_status: MatchStatus;
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
    Views: {
      [_ in never]: never;
    };
  };
}