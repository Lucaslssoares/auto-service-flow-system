
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
import { employees as mockEmployees } from "@/data/mockData";
import { Employee } from "@/types";
import { format } from "date-fns";
import { Plus, Search, Users } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    document: "",
    joinDate: format(new Date(), "yyyy-MM-dd"),
    salary: 0,
    commissionType: "percentage",
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: name === "salary" 
        ? Number(value) 
        : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new employee
    const newEmployeeEntry: Employee = {
      id: (employees.length + 1).toString(),
      name: newEmployee.name,
      role: newEmployee.role,
      phone: newEmployee.phone,
      email: newEmployee.email,
      document: newEmployee.document,
      joinDate: new Date(newEmployee.joinDate),
      salary: newEmployee.salary,
      commissionType: newEmployee.commissionType as "fixed" | "percentage" | "mixed",
    };
    
    // Add to employee list
    setEmployees([...employees, newEmployeeEntry]);
    
    // Reset form
    setNewEmployee({
      name: "",
      role: "",
      phone: "",
      email: "",
      document: "",
      joinDate: format(new Date(), "yyyy-MM-dd"),
      salary: 0,
      commissionType: "percentage",
    });
    
    // Close dialog
    setOpen(false);
  };

  const commissionTypeNames = {
    fixed: "Fixo",
    percentage: "Porcentagem",
    mixed: "Misto",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
                <DialogDescription>
                  Preencha os dados do funcionário abaixo.
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
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Cargo
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    value={newEmployee.role}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document" className="text-right">
                    Documento
                  </Label>
                  <Input
                    id="document"
                    name="document"
                    value={newEmployee.document}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="joinDate" className="text-right">
                    Data de Entrada
                  </Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={newEmployee.joinDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary" className="text-right">
                    Salário Base
                  </Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={newEmployee.salary}
                    onChange={handleInputChange}
                    className="col-span-3"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="commissionType" className="text-right">
                    Tipo de Comissão
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      name="commissionType"
                      value={newEmployee.commissionType} 
                      onValueChange={(value) => handleSelectChange("commissionType", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo de Comissão</SelectLabel>
                          <SelectItem value="fixed">Fixo</SelectItem>
                          <SelectItem value="percentage">Porcentagem</SelectItem>
                          <SelectItem value="mixed">Misto</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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
            placeholder="Buscar funcionários..."
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
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data de Entrada</TableHead>
              <TableHead className="text-right">Salário Base</TableHead>
              <TableHead>Tipo de Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{employee.phone}</span>
                      <span className="text-xs text-muted-foreground">{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(employee.joinDate, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {employee.salary.toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell>
                    {commissionTypeNames[employee.commissionType]}
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

export default Employees;
