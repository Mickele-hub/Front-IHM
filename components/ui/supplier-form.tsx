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
import { Supplier } from "@/types";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  telephone: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
  }),
  adresse: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  email: z.string().email({
    message: "L'email doit être un email valide.",
  }),
});

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
}: SupplierFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: supplier?.nom || "",
      telephone: supplier?.telephone || "",
      adresse: supplier?.adresse || "",
      email: supplier?.email || "",
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
                <FormLabel>Nom du fournisseur</FormLabel>
                <FormControl>
                  <Input placeholder="MediSource International" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="+33 1 23 45 67 89" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@fournisseur.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="15 Rue des Pharmaciens, 75001 Paris" 
                    {...field} 
                    className="resize-none"
                  />
                </FormControl>
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
            {supplier ? "Modifier" : "Ajouter"} le fournisseur
          </Button>
        </div>
      </form>
    </Form>
  );
}