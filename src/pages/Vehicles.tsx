
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { useVehicleManagement } from "@/hooks/useVehicleManagement";
import { useCustomerManagement } from "@/hooks/useCustomerManagement";
import { useState, useEffect } from "react";
import { Vehicle, VehicleType } from "@/types";

const Vehicles = () => {
  const {
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
    closeDialog
  } = useVehicleManagement();

  const { customers } = useCustomerManagement();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    plate: "",
    model: "",
    brand: "",
    color: "",
    type: "car" as VehicleType,
    year: new Date().getFullYear(),
  });

  // Reset form when dialog opens/closes or editing vehicle changes
  const resetForm = () => {
    if (editingVehicle) {
      setFormData({
        customerId: editingVehicle.customerId,
        plate: editingVehicle.plate,
        model: editingVehicle.model,
        brand: editingVehicle.brand,
        color: editingVehicle.color,
        type: editingVehicle.type,
        year: editingVehicle.year || new Date().getFullYear(),
      });
    } else {
      setFormData({
        customerId: "",
        plate: "",
        model: "",
        brand: "",
        color: "",
        type: "car",
        year: new Date().getFullYear(),
      });
    }
  };

  // Reset form when dialog state changes
  useEffect(() => {
    if (dialogOpen) {
      resetForm();
    }
  }, [dialogOpen, editingVehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.customerId || !formData.plate.trim() || !formData.brand.trim() || 
        !formData.model.trim() || !formData.color.trim()) {
      return;
    }
    
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      return;
    }

    const vehicleData = {
      ...formData,
      plate: formData.plate.toUpperCase(),
    };

    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, vehicleData);
    } else {
      await addVehicle(vehicleData);
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (vehicleToDelete) {
      await deleteVehicle(vehicleToDelete.id);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const vehicleTypeNames: Record<VehicleType, string> = {
    car: "Carro",
    motorcycle: "Moto",
    truck: "Caminhão",
    other: "Outro",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Veículos</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? "Editar Veículo" : "Adicionar Novo Veículo"}
                </DialogTitle>
                <DialogDescription>
                  {editingVehicle 
                    ? "Atualize os dados do veículo abaixo." 
                    : "Preencha os dados do veículo abaixo."
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customerId" className="text-right">
                    Cliente
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      name="customerId"
                      value={formData.customerId} 
                      onValueChange={(value) => handleSelectChange("customerId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Clientes</SelectLabel>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plate" className="text-right">
                    Placa
                  </Label>
                  <Input
                    id="plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="ABC-1234"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">
                    Marca
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    Modelo
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Cor
                  </Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      name="type"
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange("type", value as VehicleType)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo de Veículo</SelectLabel>
                          <SelectItem value="car">Carro</SelectItem>
                          <SelectItem value="motorcycle">Moto</SelectItem>
                          <SelectItem value="truck">Caminhão</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Ano
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="col-span-3"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVehicle ? "Atualizar" : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar veículos..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando veículos...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? "Nenhum veículo encontrado para a busca." : "Nenhum veículo cadastrado."}
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.color}</TableCell>
                  <TableCell>{vehicleTypeNames[vehicle.type]}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.customerName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(vehicle)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(vehicle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o veículo "{vehicleToDelete?.plate}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vehicles;
