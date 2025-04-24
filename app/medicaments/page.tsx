"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Plus, PenSquare, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MedicationForm } from "@/components/ui/medication-form";
import { Medication } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { medications, getSupplierById } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StockStatusBadge } from "@/components/stock-status-badge";

export default function MedicamentsPage() {
  const [medicationsList, setMedicationsList] = useState<Medication[]>(medications);
  const [selectedMedication, setSelectedMedication] = useState<Medication | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);

  const columns = [
    {
      accessorKey: "nom",
      header: "Médicament",
    },
    {
      accessorKey: "reference",
      header: "Référence",
    },
    {
      accessorKey: "categorie",
      header: "Catégorie",
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <div className="flex items-center gap-2">
            {stock}
            <StockStatusBadge stock={stock} />
          </div>
        );
      },
    },
    {
      accessorKey: "date_expiration",
      header: "Date d'expiration",
      cell: ({ row }) => {
        return format(new Date(row.original.date_expiration), "dd/MM/yyyy", { locale: fr });
      },
    },
    {
      accessorKey: "prix",
      header: "Prix (€)",
      cell: ({ row }) => {
        return <div>{row.original.prix.toFixed(2)} €</div>;
      },
    },
    {
      accessorKey: "fournisseur_id",
      header: "Fournisseur",
      cell: ({ row }) => {
        const supplier = getSupplierById(row.original.fournisseur_id);
        return supplier?.nom || "Inconnu";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const medication = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEditClick(medication)}
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMedicationToDelete(medication)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAddMedication = (values: any) => {
    const newMedication: Medication = {
      medicament_id: `m${Math.floor(Math.random() * 10000)}`,
      nom: values.nom,
      reference: values.reference,
      categorie: values.categorie,
      stock: values.stock,
      date_expiration: values.date_expiration.toISOString().split('T')[0],
      prix: values.prix,
      fournisseur_id: values.fournisseur_id,
      created_at: new Date().toISOString(),
    };
    
    setMedicationsList([...medicationsList, newMedication]);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };

  const handleEditMedication = (values: any) => {
    if (!selectedMedication) return;
    
    const updatedMedications = medicationsList.map((med) => {
      if (med.medicament_id === selectedMedication.medicament_id) {
        return {
          ...med,
          nom: values.nom,
          reference: values.reference,
          categorie: values.categorie,
          stock: values.stock,
          date_expiration: values.date_expiration.toISOString().split('T')[0],
          prix: values.prix,
          fournisseur_id: values.fournisseur_id,
        };
      }
      return med;
    });
    
    setMedicationsList(updatedMedications);
    setIsEditDialogOpen(false);
  };

  const handleDeleteMedication = () => {
    if (!medicationToDelete) return;
    
    const updatedMedications = medicationsList.filter(
      (med) => med.medicament_id !== medicationToDelete.medicament_id
    );
    
    setMedicationsList(updatedMedications);
    setMedicationToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Pill className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">Gestion des médicaments</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un médicament
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau médicament</DialogTitle>
            </DialogHeader>
            <MedicationForm
              onSubmit={handleAddMedication}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des médicaments</CardTitle>
          <CardDescription>
            Gérez votre inventaire de médicaments, ajoutez de nouveaux produits ou modifiez les existants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={medicationsList}
            searchColumn="nom"
            searchPlaceholder="Rechercher un médicament..."
          />
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le médicament</DialogTitle>
          </DialogHeader>
          {selectedMedication && (
            <MedicationForm
              medication={selectedMedication}
              onSubmit={handleEditMedication}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!medicationToDelete} onOpenChange={(open) => !open && setMedicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le médicament{" "}
              <span className="font-semibold">{medicationToDelete?.nom}</span> ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteMedication}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}