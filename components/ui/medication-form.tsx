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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Medication, Supplier } from "@/types";
import { suppliers } from "@/lib/mock-data";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  reference: z.string().min(3, {
    message: "La référence doit contenir au moins 3 caractères.",
  }),
  categorie: z.string().min(2, {
    message: "La catégorie doit contenir au moins 2 caractères.",
  }),
  stock: z.coerce.number().min(0, {
    message: "Le stock ne peut pas être négatif.",
  }),
  prix: z.coerce.number().min(0, {
    message: "Le prix ne peut pas être négatif.",
  }),
  fournisseur_id: z.string({
    required_error: "Veuillez sélectionner un fournisseur.",
  }),
  date_expiration: z.date({
    required_error: "Veuillez sélectionner une date d'expiration.",
  }),
});

interface MedicationFormProps {
  medication?: Medication;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function MedicationForm({
  medication,
  onSubmit,
  onCancel,
}: MedicationFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    medication?.date_expiration ? new Date(medication.date_expiration) : undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: medication?.nom || "",
      reference: medication?.reference || "",
      categorie: medication?.categorie || "",
      stock: medication?.stock || 0,
      prix: medication?.prix || 0,
      fournisseur_id: medication?.fournisseur_id || "",
      date_expiration: medication?.date_expiration ? new Date(medication.date_expiration) : undefined,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du médicament</FormLabel>
                <FormControl>
                  <Input placeholder="Paracétamol 500mg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Référence</FormLabel>
                <FormControl>
                  <Input placeholder="PCM500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categorie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <Input placeholder="Analgésique" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité en stock</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix unitaire (€)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_expiration"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d'expiration</FormLabel>
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

          <FormField
            control={form.control}
            name="fournisseur_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fournisseur</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.fournisseur_id} value={supplier.fournisseur_id}>
                        {supplier.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {medication ? "Modifier" : "Ajouter"} le médicament
          </Button>
        </div>
      </form>
    </Form>
  );
}