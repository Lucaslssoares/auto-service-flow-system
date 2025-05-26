
import { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/ErrorBoundary";

export const useVehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          customers (
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
        type: vehicle.type,
        customerId: vehicle.customer_id,
        customerName: vehicle.customers?.name || "",
        createdAt: new Date(vehicle.created_at),
      }));

      setVehicles(formattedVehicles);
    } catch (error: any) {
      handleError(error, 'fetchVehicles');
      toast({
        title: "Erro ao carregar veículos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, "id" | "createdAt" | "customerName">) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .insert([{
          plate: vehicleData.plate,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          type: vehicleData.type,
          customer_id: vehicleData.customerId,
        }])
        .select(`
          *,
          customers (
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
        type: data.type,
        customerId: data.customer_id,
        customerName: data.customers?.name || "",
        createdAt: new Date(data.created_at),
      };

      setVehicles(prev => [...prev, newVehicle]);
      setDialogOpen(false);
      
      toast({
        title: "Veículo adicionado com sucesso!",
        description: `${vehicleData.brand} ${vehicleData.model} foi cadastrado.`,
      });
    } catch (error: any) {
      handleError(error, 'addVehicle');
      toast({
        title: "Erro ao adicionar veículo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateVehicle = async (id: string, vehicleData: Omit<Vehicle, "id" | "createdAt" | "customerName">) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .update({
          plate: vehicleData.plate,
          brand: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          type: vehicleData.type,
          customer_id: vehicleData.customerId,
        })
        .eq("id", id)
        .select(`
          *,
          customers (
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
        type: data.type,
        customerId: data.customer_id,
        customerName: data.customers?.name || "",
        createdAt: new Date(data.created_at),
      };

      setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
      setDialogOpen(false);
      setEditingVehicle(null);
      
      toast({
        title: "Veículo atualizado com sucesso!",
        description: `${vehicleData.brand} ${vehicleData.model} foi atualizado.`,
      });
    } catch (error: any) {
      handleError(error, 'updateVehicle');
      toast({
        title: "Erro ao atualizar veículo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== id));
      
      toast({
        title: "Veículo removido com sucesso!",
        description: "O veículo foi removido do sistema.",
      });
    } catch (error: any) {
      handleError(error, 'deleteVehicle');
      toast({
        title: "Erro ao remover veículo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingVehicle(null);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    filteredVehicles,
    searchTerm,
    dialogOpen,
    editingVehicle,
    isLoading,
    setDialogOpen,
    handleSearch,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    openEditDialog,
    closeDialog,
    refreshVehicles: fetchVehicles
  };
};
