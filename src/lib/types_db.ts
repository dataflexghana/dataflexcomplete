export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agentcommissionsettings: {
        Row: {
          data_bundle_commission_rate: number
          id: number
          updated_at: string | null
        }
        Insert: {
          data_bundle_commission_rate: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          data_bundle_commission_rate?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      cashoutrequests: {
        Row: {
          admin_notes: string | null
          agent_id: number
          amount: number
          id: string
          processed_date: string | null
          requested_date: string | null
          status: string
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          agent_id: number
          amount: number
          id: string
          processed_date?: string | null
          requested_date?: string | null
          status: string
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          agent_id?: number
          amount?: number
          id?: string
          processed_date?: string | null
          requested_date?: string | null
          status?: string
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cashoutrequests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      databundles: {
        Row: {
          created_at: string | null
          data_amount: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
          validity_period_days: number
        }
        Insert: {
          created_at?: string | null
          data_amount: string
          description?: string | null
          id: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
          validity_period_days: number
        }
        Update: {
          created_at?: string | null
          data_amount?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          validity_period_days?: number
        }
        Relationships: []
      }
      gigorders: {
        Row: {
          admin_notes: string | null
          agent_commission_earned: number | null
          agent_id: number
          agent_notes: string | null
          client_contact: string | null
          client_name: string | null
          gig_id: string
          gig_name_snapshot: string
          id: string
          order_date: string | null
          payment_reference: string | null
          price_paid: number
          processed_date: string | null
          requirements: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          agent_commission_earned?: number | null
          agent_id: number
          agent_notes?: string | null
          client_contact?: string | null
          client_name?: string | null
          gig_id: string
          gig_name_snapshot: string
          id: string
          order_date?: string | null
          payment_reference?: string | null
          price_paid: number
          processed_date?: string | null
          requirements?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          agent_commission_earned?: number | null
          agent_id?: number
          agent_notes?: string | null
          client_contact?: string | null
          client_name?: string | null
          gig_id?: string
          gig_name_snapshot?: string
          id?: string
          order_date?: string | null
          payment_reference?: string | null
          price_paid?: number
          processed_date?: string | null
          requirements?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gigorders_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gigorders_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      gigs: {
        Row: {
          category: string | null
          commission_fixed_amount: number
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          terms_and_conditions: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          commission_fixed_amount: number
          created_at?: string | null
          description: string
          id: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          terms_and_conditions?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          commission_fixed_amount?: number
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          terms_and_conditions?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      globalmessages: {
        Row: {
          admin_id: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string
        }
        Insert: {
          admin_id?: number | null
          created_at?: string | null
          id: string
          is_active?: boolean | null
          message: string
        }
        Update: {
          admin_id?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "globalmessages_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          agent_id: number
          bundle_id: string
          bundle_name_snapshot: string
          id: string
          order_date: string | null
          payment_reference: string | null
          price_paid: number
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id: number
          bundle_id: string
          bundle_name_snapshot: string
          id: string
          order_date?: string | null
          payment_reference?: string | null
          price_paid: number
          status: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: number
          bundle_id?: string
          bundle_name_snapshot?: string
          id?: string
          order_date?: string | null
          payment_reference?: string | null
          price_paid?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "databundles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          commission_balance: number | null
          created_at: string | null
          email: string
          id: number
          is_approved: boolean | null
          last_dismissed_global_message_id: string | null
          name: string
          password_hash: string
          phone_number: string | null
          role: string
          status: string | null
          subscription_expiry_date: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          commission_balance?: number | null
          created_at?: string | null
          email: string
          id?: number
          is_approved?: boolean | null
          last_dismissed_global_message_id?: string | null
          name: string
          password_hash: string
          phone_number?: string | null
          role: string
          status?: string | null
          subscription_expiry_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          commission_balance?: number | null
          created_at?: string | null
          email?: string
          id?: number
          is_approved?: boolean | null
          last_dismissed_global_message_id?: string | null
          name?: string
          password_hash?: string
          phone_number?: string | null
          role?: string
          status?: string | null
          subscription_expiry_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
