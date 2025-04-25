"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Plus, PenSquare, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MedicationForm } from "@/components/ui/medication-form";
import { Medication } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getMedications, addMedication, updateMedication, deleteMedication, getSuppliers } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StockStatusBadge } from "@/components/stock-status-badge";

export default function MedicamentsPage() {
  const [medicationsList, setMedicationsList] = useState<Medication[]>([]);
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);

  useEffect(() => {
    getMedications().then(setMedicationsList);
    getSuppliers().then(setSuppliersList);
  }, []);

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
      cell: ({ row }: { row: { original: Medication } }) => {
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
      cell: ({ row }: { row: { original: Medication } }) => {
        const date = row.original.date_expiration;
        if (!date) return "-";
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return "-";
        return format(parsedDate, "dd/MM/yyyy", { locale: fr });
      },
    },
    {
      accessorKey: "prix",
      header: "Prix (€)",
      cell: ({ row }: { row: { original: Medication } }) => {
        const prix = row.original.prix;
        if (typeof prix !== "number" || isNaN(prix)) return "-";
        return <div>{prix.toFixed(2)} €</div>;
      },
    },
    {
      accessorKey: "fournisseur_id",
      header: "Fournisseur",
      cell: ({ row }: { row: { original: Medication } }) => {
        const supplier = suppliersList.find((supplier) => supplier.id === row.original.fournisseur_id);
        return supplier?.nom || "Inconnu";
      },
    },
    {
      accessorKey: "created_at",
      header: "Date d'ajout",
      cell: ({ row }: { row: { original: Medication } }) => {
        const date = row.original.created_at;
        if (!date) return "-";
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return "-";
        return format(parsedDate, "dd/MM/yyyy", { locale: fr });
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Medication } }) => {
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

  function handleAddMedication(values: { nom: string; reference: string; categorie: string; stock: number; date_expiration: Date; prix: number; fournisseur_id: string; }) {
    const payload = {
      ...values,
      date_expiration: values.date_expiration.toISOString().split('T')[0],
    };
    addMedication(payload as Omit<Medication, "medicament_id"|"created_at">).then((newMedication) => setMedicationsList((list) => [...list, newMedication]));
    setIsAddDialogOpen(false);
  }

  function handleEditMedication(id: string, values: { nom: string; reference: string; categorie: string; stock: number; date_expiration: Date; prix: number; fournisseur_id: string; }) {
    const payload = {
      ...values,
      date_expiration: values.date_expiration.toISOString().split('T')[0],
    };
    updateMedication(id, payload as Partial<Medication>).then((updated) => setMedicationsList((list) => list.map(m => m.medicament_id === id ? updated : m)));
    setIsEditDialogOpen(false);
  }

  const handleEditClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };

  function handleDeleteMedication(id: string) {
    deleteMedication(id).then(() => setMedicationsList((list) => list.filter(m => m.medicament_id !== id)));
    setMedicationToDelete(null);
  }

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
              onSubmit={(values) => handleEditMedication(selectedMedication.medicament_id, values)}
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
              onClick={() => medicationToDelete && handleDeleteMedication(medicationToDelete.medicament_id)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}