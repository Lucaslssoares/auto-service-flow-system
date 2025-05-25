
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          name: string;
          role: string;
          phone: string;
          email: string;
          document: string;
          join_date: string;
          salary: number;
          commission_type: 'fixed' | 'percentage' | 'mixed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          phone: string;
          email: string;
          document: string;
          join_date: string;
          salary: number;
          commission_type: 'fixed' | 'percentage' | 'mixed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          phone?: string;
          email?: string;
          document?: string;
          join_date?: string;
          salary?: number;
          commission_type?: 'fixed' | 'percentage' | 'mixed';
          created_at?: string;
          updated_at?: string;
        };
      };
      service_executions: {
        Row: {
          id: string;
          appointment_id: string;
          service_id: string;
          employee_id: string;
          start_time: string;
          end_time: string | null;
          status: 'pending' | 'in-progress' | 'completed';
          profit_percentage: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          service_id: string;
          employee_id: string;
          start_time: string;
          end_time?: string | null;
          status?: 'pending' | 'in-progress' | 'completed';
          profit_percentage?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          service_id?: string;
          employee_id?: string;
          start_time?: string;
          end_time?: string | null;
          status?: 'pending' | 'in-progress' | 'completed';
          profit_percentage?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
