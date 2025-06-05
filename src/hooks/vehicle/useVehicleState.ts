
import { useState } from "react";
import { Vehicle } from "@/types";

export const useVehicleState = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.customerName && vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
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

  return {
    vehicles,
    setVehicles,
    searchTerm,
    filteredVehicles,
    dialogOpen,
    setDialogOpen,
    editingVehicle,
    setEditingVehicle,
    handleSearch,
    openEditDialog,
    closeDialog,
  };
};
