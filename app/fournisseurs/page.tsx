"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TruckIcon, Plus, PenSquare, Trash2, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SupplierForm } from "@/components/ui/supplier-form";
import { Supplier } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { suppliers } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function FournisseursPage() {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const columns = [
    {
      accessorKey: "nom",
      header: "Nom",
    },
    {
      accessorKey: "telephone",
      header: "Téléphone",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            {row.original.telephone}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            {row.original.email}
          </div>
        );
      },
    },
    {
      accessorKey: "adresse",
      header: "Adresse",
    },
    {
      accessorKey: "created_at",
      header: "Date d'ajout",
      cell: ({ row }) => {
        return format(new Date(row.original.created_at), "dd/MM/yyyy", { locale: fr });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEditClick(supplier)}
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSupplierToDelete(supplier)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddSupplier = (values: any) => {
    const newSupplier: Supplier = {
      fournisseur_id: `f${Math.floor(Math.random() * 10000)}`,
      nom: values.nom,
      telephone: values.telephone,
      adresse: values.adresse,
      email: values.email,
      created_at: new Date().toISOString(),
    };
    
    setSuppliersList([...suppliersList, newSupplier]);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  const handleEditSupplier = (values: any) => {
    if (!selectedSupplier) return;
    
    const updatedSuppliers = suppliersList.map((sup) => {
      if (sup.fournisseur_id === selectedSupplier.fournisseur_id) {
        return {
          ...sup,
          nom: values.nom,
          telephone: values.telephone,
          adresse: values.adresse,
          email: values.email,
        };
      }
      return sup;
    });
    
    setSuppliersList(updatedSuppliers);
    setIsEditDialogOpen(false);
  };

  const handleDeleteSupplier = () => {
    if (!supplierToDelete) return;
    
    const updatedSuppliers = suppliersList.filter(
      (sup) => sup.fournisseur_id !== supplierToDelete.fournisseur_id
    );
    
    setSuppliersList(updatedSuppliers);
    setSupplierToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TruckIcon className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">Gestion des fournisseurs</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau fournisseur</DialogTitle>
            </DialogHeader>
            <SupplierForm
              onSubmit={handleAddSupplier}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des fournisseurs</CardTitle>
          <CardDescription>
            Gérez vos fournisseurs de médicaments, ajoutez de nouveaux contacts ou modifiez les existants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={suppliersList}
            searchColumn="nom"
            searchPlaceholder="Rechercher un fournisseur..."
          />
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le fournisseur</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierForm
              supplier={selectedSupplier}
              onSubmit={handleEditSupplier}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!supplierToDelete} onOpenChange={(open) => !open && setSupplierToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le fournisseur{" "}
              <span className="font-semibold">{supplierToDelete?.nom}</span> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteSupplier}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}