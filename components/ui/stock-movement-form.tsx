"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockMovement, Medication } from "@/types";
import { useState, useEffect } from "react";
import { getMedications } from "@/lib/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formSchema = z.object({
  medicament_id: z.string({
    required_error: "Veuillez sélectionner un médicament",
  }),
  type_mouvement: z.enum(["entrée", "sortie"], {
    required_error: "Veuillez sélectionner un type de mouvement",
  }),
  quantite: z.coerce.number().min(1, {
    message: "La quantité doit être supérieure à 0",
  }),
  date_mouvement: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
});

interface StockMovementFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function StockMovementForm({
  onSubmit,
  onCancel,
}: StockMovementFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [medications, setMedications] = useState<Medication[]>([]);
  const [typeMouvement, setTypeMouvement] = useState<string>("entrée");

  useEffect(() => {
    getMedications().then(setMedications);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicament_id: "",
      type_mouvement: "entrée",
      quantite: 1,
      date_mouvement: new Date(),
    },
  });

  const selectedMedicament = medications.find(
    (m) => m.medicament_id === form.watch('medicament_id')
  );

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const selectedMedicament = medications.find(
      (m) => String(m.medicament_id) === values.medicament_id
    );

    if (values.type_mouvement === "sortie") {
      if (!selectedMedicament || values.quantite > selectedMedicament.stock) {
        form.setError("quantite", {
          type: "manual",
          message: `Vous ne pouvez pas sortir plus de ${selectedMedicament?.stock ?? 0} unités.`,
        });
        return;
      }
    }

    onSubmit(values);
  }

  function handleTypeMouvementChange(value: "entrée" | "sortie") {
    setTypeMouvement(value);
    form.setValue("type_mouvement", value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="medicament_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médicament</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un médicament" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medications.map((med) => (
                      <SelectItem key={med.medicament_id} value={String(med.medicament_id)}>
                        {med.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {!field.value && (
                  <div className="text-xs text-red-600 mt-2">Veuillez choisir un médicament</div>
                )}
                {typeMouvement === "sortie" && selectedMedicament && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Stock disponible : <span className={selectedMedicament.stock < 10 ? "text-red-600" : "text-foreground"}>{selectedMedicament.stock}</span>
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type_mouvement"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type de mouvement</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={handleTypeMouvementChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="entrée" id="entree" />
                      </FormControl>
                      <FormLabel htmlFor="entree">Entrée de stock</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="sortie" id="sortie" />
                      </FormControl>
                      <FormLabel htmlFor="sortie">Sortie de stock</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantite"
            render={({ field }) => {
              const max = typeMouvement === "sortie" && selectedMedicament ? selectedMedicament.stock : undefined;
              return (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max={max} {...field} />
                  </FormControl>
                  {typeMouvement === "sortie" && selectedMedicament && (
                    <div className="text-xs text-red-600 mt-1">
                      {selectedMedicament.stock === 0
                        ? "Aucun stock disponible pour ce médicament."
                        : `Vous ne pouvez pas sortir plus de ${selectedMedicament.stock} unités.`}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="date_mouvement"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date du mouvement</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDate(date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={!form.watch("medicament_id") || form.formState.isSubmitting}>
            Enregistrer le mouvement
          </Button>
        </div>
      </form>
    </Form>
  );
}