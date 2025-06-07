// Define a interface principal do banco de dados
export interface Database {
  public: { // Namespace público do banco (padrão no Supabase)
    Tables: {
      
      // Tabela de perfis de usuário (ex: administradores, clientes, etc.)
      profiles: {
        Row: { // Representa um registro completo da tabela (resultado de SELECT)
          id: string;            // ID único do perfil
          name: string;          // Nome do usuário
          email: string;         // E-mail do usuário
          role: string;          // Papel ou função no sistema (ex: admin, user)
          created_at: string;    // Data de criação do registro (em ISO string)
          updated_at: string;    // Data da última atualização
        };
        Insert: { // Campos exigidos ao inserir um novo registro (INSERT)
          id: string;
          name: string;
          email: string;
          role?: string;         // Campo opcional (pode ter valor padrão no banco)
          created_at?: string;   // Opcional, pode ser definido automaticamente
          updated_at?: string;   // Opcional
        };
        Update: { // Campos permitidos ao atualizar um registro (UPDATE)
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabela de funcionários
      employees: {
        Row: {
          id: string;                   // ID do funcionário
          name: string;                 // Nome completo
          role: string;                 // Cargo/função
          phone: string;                // Número de telefone
          email: string;                // Endereço de e-mail
          document: string;             // Documento de identificação (ex: CPF)
          join_date: string;            // Data de entrada na empresa
          salary: number;               // Salário base
          commission_type: 'fixed' | 'percentage' | 'mixed'; // Tipo de comissão
          created_at: string;           // Data de criação do registro
          updated_at: string;           // Última modificação
        };
        Insert: {
          id?: string;                  // Opcional (gerado automaticamente)
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

      // Tabela que registra a execução dos serviços (durante agendamentos)
      service_executions: {
        Row: {
          id: string;                         // ID único da execução
          appointment_id: string;            // ID do agendamento relacionado
          service_id: string;                // ID do serviço executado
          employee_id: string;               // Funcionário que executou o serviço
          start_time: string;                // Data/hora de início da execução
          end_time: string | null;           // Data/hora de término (ou nulo se não finalizado)
          status: 'pending' | 'in-progress' | 'completed'; // Status atual
          profit_percentage: number;         // Percentual de lucro gerado
          notes: string | null;              // Observações adicionais
          created_at: string;                // Data de criação do registro
        };
        Insert: {
          id?: string;
          appointment_id: string;
          service_id: string;
          employee_id: string;
          start_time: string;
          end_time?: string | null;
          status?: 'pending' | 'in-progress' | 'completed'; // Pode ter valor padrão
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
