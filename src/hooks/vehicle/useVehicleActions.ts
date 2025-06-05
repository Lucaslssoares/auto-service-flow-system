
import { useEffect } from "react";
import { Vehicle } from "@/types";
import { useVehicleOperations } from "./useVehicleOperations";
import { useVehicleState } from "./useVehicleState";

export const useVehicleActions = () => {
  const operations = useVehicleOperations();
  const state = useVehicleState();

  const refreshVehicles = async () => {
    const fetchedVehicles = await operations.fetchVehicles();
    state.setVehicles(fetchedVehicles);
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, "id" | "customerName">) => {
    const newVehicle = await operations.addVehicle(vehicleData);
    if (newVehicle) {
      state.setVehicles(prev => [...prev, newVehicle]);
      state.setDialogOpen(false);
    }
  };

  const updateVehicle = async (id: string, vehicleData: Omit<Vehicle, "id" | "customerName">) => {
    const updatedVehicle = await operations.updateVehicle(id, vehicleData);
    if (updatedVehicle) {
      state.setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
      state.setDialogOpen(false);
      state.setEditingVehicle(null);
    }
  };

  const deleteVehicle = async (id: string) => {
    const success = await operations.deleteVehicle(id);
    if (success) {
      state.setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  return {
    ...state,
    isLoading: operations.isLoading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refreshVehicles,
  };
};
