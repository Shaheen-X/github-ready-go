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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_id: string
          capacity: number | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          host_id: string | null
          is_group_activity: boolean | null
          is_public: boolean | null
          location_name: string | null
          place_id: string | null
          proposed_times: Json | null
          recurrence_pattern: string | null
          scheduled_datetime: string | null
          sport_type: string | null
          status: string | null
          tags: Json | null
          time_flexibility: string | null
          time_status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          activity_id: string
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          host_id?: string | null
          is_group_activity?: boolean | null
          is_public?: boolean | null
          location_name?: string | null
          place_id?: string | null
          proposed_times?: Json | null
          recurrence_pattern?: string | null
          scheduled_datetime?: string | null
          sport_type?: string | null
          status?: string | null
          tags?: Json | null
          time_flexibility?: string | null
          time_status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_id?: string
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          host_id?: string | null
          is_group_activity?: boolean | null
          is_public?: boolean | null
          location_name?: string | null
          place_id?: string | null
          proposed_times?: Json | null
          recurrence_pattern?: string | null
          scheduled_datetime?: string | null
          sport_type?: string | null
          status?: string | null
          tags?: Json | null
          time_flexibility?: string | null
          time_status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_participants: {
        Row: {
          activity_id: string
          id: string
          joined_at: string
          status: string
          user_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          joined_at?: string
          status?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          joined_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      activityplaces: {
        Row: {
          address: string | null
          availability_schedule: Json | null
          business_id: string | null
          location: Json | null
          name: string | null
          place_id: string
          price_per_hour: number | null
          rating: number | null
          type: string | null
        }
        Insert: {
          address?: string | null
          availability_schedule?: Json | null
          business_id?: string | null
          location?: Json | null
          name?: string | null
          place_id: string
          price_per_hour?: number | null
          rating?: number | null
          type?: string | null
        }
        Update: {
          address?: string | null
          availability_schedule?: Json | null
          business_id?: string | null
          location?: Json | null
          name?: string | null
          place_id?: string
          price_per_hour?: number | null
          rating?: number | null
          type?: string | null
        }
        Relationships: []
      }
      appusages: {
        Row: {
          app_version: string | null
          device_type: string | null
          duration: number | null
          feature: string | null
          timestamp: string | null
          usage_id: string
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          device_type?: string | null
          duration?: number | null
          feature?: string | null
          timestamp?: string | null
          usage_id: string
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          device_type?: string | null
          duration?: number | null
          feature?: string | null
          timestamp?: string | null
          usage_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          activity_id: string | null
          booked_by_id: string | null
          booking_id: string
          cancellation_policy: string | null
          end_time: string | null
          payment_status: string | null
          place_id: string | null
          start_time: string | null
          status: string | null
        }
        Insert: {
          activity_id?: string | null
          booked_by_id?: string | null
          booking_id: string
          cancellation_policy?: string | null
          end_time?: string | null
          payment_status?: string | null
          place_id?: string | null
          start_time?: string | null
          status?: string | null
        }
        Update: {
          activity_id?: string | null
          booked_by_id?: string | null
          booking_id?: string
          cancellation_policy?: string | null
          end_time?: string | null
          payment_status?: string | null
          place_id?: string | null
          start_time?: string | null
          status?: string | null
        }
        Relationships: []
      }
      calendarentries: {
        Row: {
          activity_id: string | null
          calendar_id: string | null
          entry_id: string
          scheduled_datetime: string | null
        }
        Insert: {
          activity_id?: string | null
          calendar_id?: string | null
          entry_id: string
          scheduled_datetime?: string | null
        }
        Update: {
          activity_id?: string | null
          calendar_id?: string | null
          entry_id?: string
          scheduled_datetime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendarentries_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "calendarentries_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["calendar_id"]
          },
        ]
      }
      calendars: {
        Row: {
          calendar_id: string
          is_group_calendar: boolean | null
          owner_id: string | null
        }
        Insert: {
          calendar_id: string
          is_group_calendar?: boolean | null
          owner_id?: string | null
        }
        Update: {
          calendar_id?: string
          is_group_calendar?: boolean | null
          owner_id?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          activity_id: string | null
          coach_id: string | null
          comment: string | null
          created_at: string | null
          feedback_id: string
          given_by_user_id: string | null
          place_id: string | null
          rating: number | null
        }
        Insert: {
          activity_id?: string | null
          coach_id?: string | null
          comment?: string | null
          created_at?: string | null
          feedback_id: string
          given_by_user_id?: string | null
          place_id?: string | null
          rating?: number | null
        }
        Update: {
          activity_id?: string | null
          coach_id?: string | null
          comment?: string | null
          created_at?: string | null
          feedback_id?: string
          given_by_user_id?: string | null
          place_id?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      groupmembers: {
        Row: {
          group_id: string
          invite_status: string
          is_admin: boolean | null
          joined_at: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          invite_status?: string
          is_admin?: boolean | null
          joined_at?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          invite_status?: string
          is_admin?: boolean | null
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groupmembers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          group_id: string
          name: string | null
          privacy_type: string | null
          sport_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          group_id: string
          name?: string | null
          privacy_type?: string | null
          sport_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          group_id?: string
          name?: string | null
          privacy_type?: string | null
          sport_type?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          location_id: string | null
          match_date: string | null
          match_id: string
          match_type: string | null
          score: Json | null
          status: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          location_id?: string | null
          match_date?: string | null
          match_id: string
          match_type?: string | null
          score?: Json | null
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          location_id?: string | null
          match_date?: string | null
          match_id?: string
          match_type?: string | null
          score?: Json | null
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          deleted_at: string | null
          group_id: string | null
          is_read: boolean | null
          message_id: string
          message_type: string | null
          receiver_id: string | null
          sender_id: string | null
          timestamp: string | null
        }
        Insert: {
          content?: string | null
          deleted_at?: string | null
          group_id?: string | null
          is_read?: boolean | null
          message_id: string
          message_type?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          timestamp?: string | null
        }
        Update: {
          content?: string | null
          deleted_at?: string | null
          group_id?: string | null
          is_read?: boolean | null
          message_id?: string
          message_type?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_link: string | null
          activity_id: string | null
          is_read: boolean | null
          message: string | null
          notification_id: string
          sent_at: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_link?: string | null
          activity_id?: string | null
          is_read?: boolean | null
          message?: string | null
          notification_id: string
          sent_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_link?: string | null
          activity_id?: string | null
          is_read?: boolean | null
          message?: string | null
          notification_id?: string
          sent_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["activity_id"]
          },
        ]
      }
      orders: {
        Row: {
          order_id: string
          order_status: string | null
          product_id: string | null
          quantity: number | null
          timestamp: string | null
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          order_id: string
          order_status?: string | null
          product_id?: string | null
          quantity?: number | null
          timestamp?: string | null
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          order_id?: string
          order_status?: string | null
          product_id?: string | null
          quantity?: number | null
          timestamp?: string | null
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          id: string
          interests: string[] | null
          level: number | null
          location: Json | null
          name: string | null
          onboarding_completed: boolean | null
          preferences: Json | null
          skill_level: string | null
          stats: Json | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id: string
          interests?: string[] | null
          level?: number | null
          location?: Json | null
          name?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          skill_level?: string | null
          stats?: Json | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          level?: number | null
          location?: Json | null
          name?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          skill_level?: string | null
          stats?: Json | null
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          end_date: string | null
          payment_method: string | null
          plan_type: string | null
          start_date: string | null
          status: string | null
          subscription_id: string
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          end_date?: string | null
          payment_method?: string | null
          plan_type?: string | null
          start_date?: string | null
          status?: string | null
          subscription_id: string
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          end_date?: string | null
          payment_method?: string | null
          plan_type?: string | null
          start_date?: string | null
          status?: string | null
          subscription_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          coach_id: string | null
          currency: string | null
          invoice_id: string | null
          payment_method: string | null
          place_id: string | null
          product_id: string | null
          status: string | null
          timestamp: string | null
          transaction_id: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          coach_id?: string | null
          currency?: string | null
          invoice_id?: string | null
          payment_method?: string | null
          place_id?: string | null
          product_id?: string | null
          status?: string | null
          timestamp?: string | null
          transaction_id: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          coach_id?: string | null
          currency?: string | null
          invoice_id?: string | null
          payment_method?: string | null
          place_id?: string | null
          product_id?: string | null
          status?: string | null
          timestamp?: string | null
          transaction_id?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string | null
          instance_id: string | null
          invited_at: string | null
          is_anonymous: boolean | null
          is_sso_user: boolean | null
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      sync_profile_email: { Args: never; Returns: undefined }
    }
    Enums: {
      connection_status: "pending" | "accepted" | "rejected"
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
    Enums: {
      connection_status: ["pending", "accepted", "rejected"],
    },
  },
} as const
