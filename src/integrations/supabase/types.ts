export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      accessibility_preferences: {
        Row: {
          dark_mode: boolean
          high_contrast: boolean
          large_buttons: boolean
          patient_id: string
          reduce_sounds: boolean
          simplify: boolean
          slow_mode: boolean
          text_scale: number
          updated_at: string
          voice_guidance: boolean
        }
        Insert: {
          dark_mode?: boolean
          high_contrast?: boolean
          large_buttons?: boolean
          patient_id: string
          reduce_sounds?: boolean
          simplify?: boolean
          slow_mode?: boolean
          text_scale?: number
          updated_at?: string
          voice_guidance?: boolean
        }
        Update: {
          dark_mode?: boolean
          high_contrast?: boolean
          large_buttons?: boolean
          patient_id?: string
          reduce_sounds?: boolean
          simplify?: boolean
          slow_mode?: boolean
          text_scale?: number
          updated_at?: string
          voice_guidance?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "accessibility_preferences_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      cognitive_profiles: {
        Row: {
          domain: string
          id: string
          level: number
          patient_id: string
          updated_at: string
        }
        Insert: {
          domain: string
          id?: string
          level?: number
          patient_id: string
          updated_at?: string
        }
        Update: {
          domain?: string
          id?: string
          level?: number
          patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cognitive_profiles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      cultural_content: {
        Row: {
          category: string
          emoji: string
          id: string
          metadata: Json
          region: string
          title: string
        }
        Insert: {
          category: string
          emoji?: string
          id?: string
          metadata?: Json
          region: string
          title: string
        }
        Update: {
          category?: string
          emoji?: string
          id?: string
          metadata?: Json
          region?: string
          title?: string
        }
        Relationships: []
      }
      family_challenges: {
        Row: {
          created_at: string
          creator_name: string
          creator_score: number | null
          game_id: string
          id: string
          message: string
          patient_id: string
          patient_score: number | null
          status: string
        }
        Insert: {
          created_at?: string
          creator_name?: string
          creator_score?: number | null
          game_id: string
          id?: string
          message?: string
          patient_id: string
          patient_score?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          creator_name?: string
          creator_score?: number | null
          game_id?: string
          id?: string
          message?: string
          patient_id?: string
          patient_score?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_challenges_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      game_attempts: {
        Row: {
          accuracy: number
          created_at: string
          difficulty: number
          game_id: string
          id: string
          mistakes: number
          patient_id: string
          response_time: number
          score: number
          synced: boolean
        }
        Insert: {
          accuracy?: number
          created_at?: string
          difficulty?: number
          game_id: string
          id?: string
          mistakes?: number
          patient_id: string
          response_time?: number
          score?: number
          synced?: boolean
        }
        Update: {
          accuracy?: number
          created_at?: string
          difficulty?: number
          game_id?: string
          id?: string
          mistakes?: number
          patient_id?: string
          response_time?: number
          score?: number
          synced?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "game_attempts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          category: string
          description: string
          icon: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          description: string
          icon?: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          id: string
          mood: string
          patient_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: string
          patient_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number
          avatar_emoji: string
          base_difficulty: number
          caregiver_id: string
          created_at: string
          elder_mode: boolean
          id: string
          language: string
          name: string
          region: string
        }
        Insert: {
          age?: number
          avatar_emoji?: string
          base_difficulty?: number
          caregiver_id: string
          created_at?: string
          elder_mode?: boolean
          id?: string
          language?: string
          name: string
          region?: string
        }
        Update: {
          age?: number
          avatar_emoji?: string
          base_difficulty?: number
          caregiver_id?: string
          created_at?: string
          elder_mode?: boolean
          id?: string
          language?: string
          name?: string
          region?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          completed: boolean
          created_at: string
          description: string
          frequency: string
          id: string
          patient_id: string
          time: string
          title: string
          type: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string
          frequency?: string
          id?: string
          patient_id: string
          time?: string
          title: string
          type?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string
          frequency?: string
          id?: string
          patient_id?: string
          time?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
