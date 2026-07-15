// Hand-written Supabase Database types.
// IMPORTANT: these are `type` aliases (object-literal types), NOT interfaces.
// Interfaces have no implicit string index signature, which makes the typed
// supabase-js client resolve tables to `never`. Type aliases avoid that.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      orgs: {
        Row: { id: string; name: string; created_by: string; created_at: string };
        Insert: { id?: string; name: string; created_by: string; created_at?: string };
        Update: { id?: string; name?: string; created_by?: string; created_at?: string };
        Relationships: [];
      };
      org_members: {
        Row: { org_id: string; user_id: string; role: string; created_at: string };
        Insert: { org_id: string; user_id: string; role?: string; created_at?: string };
        Update: { org_id?: string; user_id?: string; role?: string; created_at?: string };
        Relationships: [];
      };
      org_invites: {
        Row: {
          id: string;
          org_id: string;
          email: string;
          invited_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          email: string;
          invited_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          email?: string;
          invited_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: { id: string; full_name: string | null; email: string | null; created_at: string };
        Insert: { id: string; full_name?: string | null; email?: string | null; created_at?: string };
        Update: { id?: string; full_name?: string | null; email?: string | null; created_at?: string };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          location: string | null;
          code: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          location?: string | null;
          code?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          location?: string | null;
          code?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      suppliers: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          location: string | null;
          on_time_rate: number;
          avg_lead_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          location?: string | null;
          on_time_rate?: number;
          avg_lead_days?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          location?: string | null;
          on_time_rate?: number;
          avg_lead_days?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      materials: {
        Row: {
          id: string;
          org_id: string;
          project_id: string | null;
          supplier_id: string | null;
          name: string;
          unit: string;
          qty: number;
          status: string;
          need_by: string | null;
          expected_arrival: string | null;
          on_time_probability: number;
          cost_of_delay_per_day: number;
          building_delay_days: number;
          paperwork: string;
          location: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          project_id?: string | null;
          supplier_id?: string | null;
          name: string;
          unit?: string;
          qty?: number;
          status?: string;
          need_by?: string | null;
          expected_arrival?: string | null;
          on_time_probability?: number;
          cost_of_delay_per_day?: number;
          building_delay_days?: number;
          paperwork?: string;
          location?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          project_id?: string | null;
          supplier_id?: string | null;
          name?: string;
          unit?: string;
          qty?: number;
          status?: string;
          need_by?: string | null;
          expected_arrival?: string | null;
          on_time_probability?: number;
          cost_of_delay_per_day?: number;
          building_delay_days?: number;
          paperwork?: string;
          location?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

// Convenience row aliases used across the app.
export type OrgRow = Database["public"]["Tables"]["orgs"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type SupplierRow = Database["public"]["Tables"]["suppliers"]["Row"];
export type MaterialRow = Database["public"]["Tables"]["materials"]["Row"];
export type OrgMemberRow = Database["public"]["Tables"]["org_members"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
