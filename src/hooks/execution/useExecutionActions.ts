
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types';

export const useExecutionActions = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: AppointmentStatus }) => {
      console.log('🔄 Atualizando status:', id, status);

      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      // Update otimista para melhor UX
      await queryClient.cancelQueries({ queryKey: ['execution_appointments'] });
      const previousData = queryClient.getQueryData(['execution_appointments']);
      
      queryClient.setQueryData(['execution_appointments'], (old: any) => {
        if (!old) return old;
        return old.map((app: any) => app.id === id ? { ...app, status } : app);
      });

      return { previousData };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['execution_appointments'], context.previousData);
      }
      console.error('❌ Erro ao atualizar status:', error);
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Status atualizado!');
    },
    onSettled: () => {
      // Invalidar apenas queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['execution_appointments'] });
    }
  });

  return {
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending
  };
};
