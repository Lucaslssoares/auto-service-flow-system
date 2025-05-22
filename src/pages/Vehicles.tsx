
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { vehicles as mockVehicles, customers, getCustomerName } from "@/data/mockData";
import { Vehicle, VehicleType } from "@/types";
import { Car, Plus, Search } from "lucide-react";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    customerId: "",
    plate: "",
    model: "",
    brand: "",
    color: "",
    type: "car" as VehicleType,
    year: new Date().getFullYear(),
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(vehicle.customerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewVehicle({
      ...newVehicle,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new vehicle
    const newVehicleEntry: Vehicle = {
      id: (vehicles.length + 1).toString(),
      customerId: newVehicle.customerId,
      plate: newVehicle.plate.toUpperCase(),
      model: newVehicle.model,
      brand: newVehicle.brand,
      color: newVehicle.color,
      type: newVehicle.type,
      year: Number(newVehicle.year),
    };
    
    // Add to vehicle list
    setVehicles([...vehicles, newVehicleEntry]);
    
    // Reset form
    setNewVehicle({
      customerId: "",
      plate: "",
      model: "",
      brand: "",
      color: "",
      type: "car",
      year: new Date().getFullYear(),
    });
    
    // Close dialog
    setOpen(false);
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
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Veículo</DialogTitle>
                <DialogDescription>
                  Preencha os dados do veículo abaixo.
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
                      value={newVehicle.customerId} 
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
                    value={newVehicle.plate}
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
                    value={newVehicle.brand}
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
                    value={newVehicle.model}
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
                    value={newVehicle.color}
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
                      value={newVehicle.type} 
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
                    value={newVehicle.year}
                    onChange={handleInputChange}
                    className="col-span-3"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum veículo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.color}</TableCell>
                  <TableCell>{vehicleTypeNames[vehicle.type]}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{getCustomerName(vehicle.customerId)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Vehicles;
