
import { useState } from "react";
import { Vehicle, VehicleType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/ErrorBoundary";

export const useVehicleOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          customers!customer_id (
            name
          )
        `)
        .order("plate");

      if (error) throw error;

      const formattedVehicles = data.map(vehicle => ({
        id: vehicle.id,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        type: vehicle.type as VehicleType,
        customerId: vehicle.customer_id,
        customerName: vehicle.customers?.name || "",
      }));

      return formattedVehicles;
    } catch (error: any) {
      handleError(error, 'fetchVehicles');
      toast({
        title: "Erro ao carregar veículos",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, "id" | "customerName">): Promise<Vehicle | null> => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .insert([{
          plate: vehicleData.plate,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          type: vehicleData.type as string,
          customer_id: vehicleData.customerId,
        }])
        .select(`
          *,
          customers!customer_id (
            name
          )
        `)
        .single();

      if (error) throw error;

      const newVehicle: Vehicle = {
        id: data.id,
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        type: data.type as VehicleType,
        customerId: data.customer_id,
        customerName: data.customers?.name || "",
      };

      toast({
        title: "Veículo adicionado com sucesso!",
        description: `${vehicleData.brand} ${vehicleData.model} foi cadastrado.`,
      });

      return newVehicle;
    } catch (error: any) {
      handleError(error, 'addVehicle');
      toast({
        title: "Erro ao adicionar veículo",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Omit<Vehicle, "id" | "customerName">): Promise<Vehicle | null> => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .update({
          plate: vehicleData.plate,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          type: vehicleData.type as string,
          customer_id: vehicleData.customerId,
        })
        .eq("id", id)
        .select(`
          *,
          customers!customer_id (
            name
          )
        `)
        .single();

      if (error) throw error;

      const updatedVehicle: Vehicle = {
        id: data.id,
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        type: data.type as VehicleType,
        customerId: data.customer_id,
        customerName: data.customers?.name || "",
      };

      toast({
        title: "Veículo atualizado com sucesso!",
        description: `${vehicleData.brand} ${vehicleData.model} foi atualizado.`,
      });

      return updatedVehicle;
    } catch (error: any) {
      handleError(error, 'updateVehicle');
      toast({
        title: "Erro ao atualizar veículo",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteVehicle = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Veículo removido com sucesso!",
        description: "O veículo foi removido do sistema.",
      });

      return true;
    } catch (error: any) {
      handleError(error, 'deleteVehicle');
      toast({
        title: "Erro ao remover veículo",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isLoading,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
