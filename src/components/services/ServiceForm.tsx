
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Service } from "@/types";

interface ServiceFormProps {
  onSubmit: (data: Omit<Service, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
  initialData?: Service | null;
}

export const ServiceForm = ({ onSubmit, onCancel, initialData }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    commissionPercentage: 30,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        price: initialData.price,
        duration: initialData.duration,
        commissionPercentage: initialData.commissionPercentage,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        commissionPercentage: 30,
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "duration" || name === "commissionPercentage" 
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      return;
    }
    
    if (formData.price < 0) {
      return;
    }
    
    if (formData.duration < 5) {
      return;
    }
    
    if (formData.commissionPercentage < 0 || formData.commissionPercentage > 100) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="col-span-3"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descrição
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="col-span-3"
            rows={3}
            disabled={isSubmitting}
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
            value={formData.price}
            onChange={handleInputChange}
            className="col-span-3"
            min="0"
            step="0.01"
            required
            disabled={isSubmitting}
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
            value={formData.duration}
            onChange={handleInputChange}
            className="col-span-3"
            min="5"
            required
            disabled={isSubmitting}
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
            value={formData.commissionPercentage}
            onChange={handleInputChange}
            className="col-span-3"
            min="0"
            max="100"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : (initialData ? "Atualizar" : "Salvar")}
        </Button>
      </DialogFooter>
    </form>
  );
};
