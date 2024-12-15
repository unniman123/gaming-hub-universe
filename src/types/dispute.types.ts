import { DisputeStatus } from './enums';

export interface DisputeCase {
  id: string;
  match_id: string;
  reported_by_id: string;
  against_id: string;
  title: string;
  description: string;
  resolution?: string;
  created_at?: string;
  updated_at?: string;
  status?: DisputeStatus;
  resolution_type?: string;
  admin_notes?: string;
}

export interface DisputeMessage {
  id: string;
  dispute_id: string;
  sender_id: string;
  message: string;
  created_at?: string;
}