
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services as mockServices } from "@/data/mockData";
import { Service } from "@/types";
import { Plus, Search, Settings } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  // New service form state
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    commissionPercentage: 30,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: name === "price" || name === "duration" || name === "commissionPercentage" 
        ? Number(value) 
        : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new service
    const newServiceEntry: Service = {
      id: (services.length + 1).toString(),
      name: newService.name,
      description: newService.description,
      price: newService.price,
      duration: newService.duration,
      commissionPercentage: newService.commissionPercentage,
    };
    
    // Add to service list
    setServices([...services, newServiceEntry]);
    
    // Reset form
    setNewService({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      commissionPercentage: 30,
    });
    
    // Close dialog
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Serviços</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                <DialogDescription>
                  Preencha os dados do serviço abaixo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newService.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newService.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Preço (R$)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={newService.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duração (min)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={newService.duration}
                    onChange={handleInputChange}
                    className="col-span-3"
                    min="5"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="commissionPercentage" className="text-right">
                    Comissão (%)
                  </Label>
                  <Input
                    id="commissionPercentage"
                    name="commissionPercentage"
                    type="number"
                    value={newService.commissionPercentage}
                    onChange={handleInputChange}
                    className="col-span-3"
                    min="0"
                    max="100"
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
            placeholder="Buscar serviços..."
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
              <TableHead>Serviço</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Duração</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {service.description}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {service.price.toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell className="text-right">
                    {service.duration} min
                  </TableCell>
                  <TableCell className="text-right">
                    {service.commissionPercentage}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Services;
