
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'cash' | 'credit' | 'debit' | 'pix' | 'other';
  status: 'pending' | 'completed' | 'cancelled';
  date: Date;
  notes?: string;
}

export const usePaymentTransactions = () => {
  const queryClient = useQueryClient();

  // Fetch payment transactions with related data
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['payment_transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          appointments(
            customers(name),
            vehicles(plate, model, brand)
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map((transaction: any) => ({
        id: transaction.id,
        appointmentId: transaction.appointment_id,
        amount: Number(transaction.amount),
        method: transaction.method,
        status: transaction.status,
        date: new Date(transaction.date),
        notes: transaction.notes,
        // Related data
        customerName: transaction.appointments?.customers?.name,
        vehicleInfo: transaction.appointments?.vehicles 
          ? `${transaction.appointments.vehicles.brand} ${transaction.appointments.vehicles.model} - ${transaction.appointments.vehicles.plate}`
          : ''
      })) as (PaymentTransaction & {
        customerName?: string;
        vehicleInfo?: string;
      })[];
    }
  });

  // Create payment transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData: Omit<PaymentTransaction, 'id'>) => {
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          appointment_id: transactionData.appointmentId,
          amount: transactionData.amount,
          method: transactionData.method,
          status: transactionData.status,
          date: transactionData.date.toISOString(),
          notes: transactionData.notes
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_transactions'] });
      toast.success('Transação de pagamento criada!');
    },
    onError: (error) => {
      console.error('Erro ao criar transação:', error);
      toast.error('Erro ao criar transação de pagamento');
    }
  });

  // Update transaction status mutation
  const updateTransactionStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentTransaction['status'] }) => {
      const { error } = await supabase
        .from('payment_transactions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_transactions'] });
      toast.success('Status da transação atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar status da transação');
    }
  });

  return {
    transactions,
    isLoading,
    createTransaction: createTransactionMutation.mutate,
    updateTransactionStatus: updateTransactionStatusMutation.mutate,
    isCreating: createTransactionMutation.isPending,
    isUpdating: updateTransactionStatusMutation.isPending
  };
};
