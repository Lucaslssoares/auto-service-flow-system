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
      appointment_services: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          id: string
          service_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          service_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_services_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointment_services_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          customer_id: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: string
          total_price: number
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status: string
          total_price: number
          user_id?: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string
          total_price?: number
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_vehicle"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          cpf: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          cpf: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          user_id?: string
        }
        Update: {
          cpf?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      employee_commissions: {
        Row: {
          appointment_id: string | null
          base_price: number
          commission_amount: number
          commission_percentage: number
          created_at: string
          employee_id: string | null
          id: string
          profit_percentage: number
          service_execution_id: string | null
          service_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          base_price: number
          commission_amount: number
          commission_percentage: number
          created_at?: string
          employee_id?: string | null
          id?: string
          profit_percentage: number
          service_execution_id?: string | null
          service_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          base_price?: number
          commission_amount?: number
          commission_percentage?: number
          created_at?: string
          employee_id?: string | null
          id?: string
          profit_percentage?: number
          service_execution_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_commissions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_commissions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_commissions_service_execution_id_fkey"
            columns: ["service_execution_id"]
            isOneToOne: false
            referencedRelation: "service_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_commissions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_service_execution"
            columns: ["service_execution_id"]
            isOneToOne: false
            referencedRelation: "service_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          commission_type: string
          created_at: string | null
          document: string
          email: string
          id: string
          join_date: string
          name: string
          phone: string
          role: string
          salary: number
          updated_at: string | null
        }
        Insert: {
          commission_type: string
          created_at?: string | null
          document: string
          email: string
          id?: string
          join_date: string
          name: string
          phone: string
          role: string
          salary?: number
          updated_at?: string | null
        }
        Update: {
          commission_type?: string
          created_at?: string | null
          document?: string
          email?: string
          id?: string
          join_date?: string
          name?: string
          phone?: string
          role?: string
          salary?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string | null
          date: string
          id: string
          method: string
          notes: string | null
          status: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          method: string
          notes?: string | null
          status: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          method?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_transactions_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_executions: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          employee_id: string | null
          end_time: string | null
          id: string
          notes: string | null
          profit_percentage: number
          service_id: string | null
          start_time: string
          status: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          profit_percentage?: number
          service_id?: string | null
          start_time: string
          status?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          profit_percentage?: number
          service_id?: string | null
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_executions_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service_executions_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_service_executions_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_executions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_executions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_executions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          commission_percentage: number
          created_at: string | null
          description: string | null
          duration: number
          id: string
          name: string
          price: number
        }
        Insert: {
          commission_percentage?: number
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          name: string
          price: number
        }
        Update: {
          commission_percentage?: number
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          color: string
          created_at: string | null
          customer_id: string | null
          id: string
          model: string
          plate: string
          type: string
          user_id: string
          year: number | null
        }
        Insert: {
          brand: string
          color: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          model: string
          plate: string
          type: string
          user_id?: string
          year?: number | null
        }
        Update: {
          brand?: string
          color?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          model?: string
          plate?: string
          type?: string
          user_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicles_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      employee_commission_summary: {
        Row: {
          appointment_date: string | null
          appointment_id: string | null
          base_price: number | null
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string | null
          customer_name: string | null
          employee_id: string | null
          employee_name: string | null
          profit_percentage: number | null
          service_id: string | null
          service_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_commissions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_commissions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_commissions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_appointment"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_commissions_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_employee_commission: {
        Args: {
          p_service_execution_id: string
          p_employee_id: string
          p_appointment_id: string
          p_service_id: string
          p_base_price: number
          p_commission_percentage: number
          p_profit_percentage: number
        }
        Returns: number
      }
      create_public_appointment: {
        Args: {
          customer_data: Json
          vehicle_data: Json
          appointment_data: Json
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "employee" | "user"
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
    Enums: {
      app_role: ["admin", "manager", "employee", "user"],
    },
  },
} as const
