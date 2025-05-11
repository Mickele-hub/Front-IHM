"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Plus, PenSquare, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MedicationForm } from "@/components/ui/medication-form";
import { Medication } from "@/types";
import { getMedications, addMedication, updateMedication, deleteMedication, getSuppliers } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StockStatusBadge } from "@/components/stock-status-badge";
import { useNotifications } from '@/context/notifications-context';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

export default function MedicamentsPage() {
  const { addNotification } = useNotifications();
  const [medicationsList, setMedicationsList] = useState<Medication[]>([]);
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);

  useEffect(() => {
    getMedications().then((meds) => {
      setMedicationsList(meds);
      // Notification stock critique
      const crit = meds.filter((m) => m.stock < 10);
      if (crit.length > 0) {
        crit.forEach((m) => {
          addNotification({
            type: 'stock_critique',
            title: `Stock critique !`,
            description: `Le médicament "${m.nom}" a un stock faible (${m.stock} unités).`
          });
        });
      }
    });
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
        // Correction : forcer la conversion en nombre pour éviter les erreurs
        const prix = Number(row.original.prix);
        if (typeof prix !== "number" || isNaN(prix)) return "-";
        return <div>{prix.toFixed(2)} €</div>;
      },
    },
    {
      accessorKey: "fournisseur_id",
      header: "Fournisseur",
      cell: ({ row }: { row: { original: Medication } }) => {
        // Affichage simple du nom du fournisseur depuis la relation
        // @ts-ignore
        return row.original.fournisseur?.nom || "Inconnu";
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
    // LOG pour debug
    console.log('Valeurs soumises à l\'API:', values);
    const payload = {
      ...values,
      date_expiration: values.date_expiration.toISOString().split('T')[0],
    };
    addMedication(payload as Omit<Medication, "medicament_id"|"created_at">).then((newMed) => {
      console.log('Réponse API après ajout:', newMed);
      getMedications().then(setMedicationsList); // Rafraîchit la liste depuis la base
      if (values.stock < 10) {
        addNotification({
          type: 'stock_critique',
          title: `Stock critique !`,
          description: `Le médicament "${values.nom}" a un stock faible (${values.stock} unités).`
        });
      }
      addNotification({
        type: 'success',
        title: `Ajout réussi`,
        description: `Le médicament "${values.nom}" a bien été ajouté.`
      });
      toast({
        title: `Ajout réussi`,
        description: `Le médicament "${values.nom}" a bien été ajouté.`
      });
    });
    setIsAddDialogOpen(false);
  }

  function handleEditMedication(id: string, values: { nom: string; reference: string; categorie: string; stock: number; date_expiration: Date; prix: number; fournisseur_id: string; }) {
    // Correction : prépare bien la relation fournisseur
    const payload = {
      ...values,
      date_expiration: values.date_expiration.toISOString().split('T')[0],
    };
    updateMedication(id, payload as Partial<Medication>).then((updatedMed) => {
      // Optionnel : log pour debug
      console.log('Réponse API après édition:', updatedMed);
      getMedications().then(setMedicationsList); // Rafraîchit la liste depuis la base
      addNotification({
        type: 'success',
        title: `Modification réussie`,
        description: `Le médicament "${values.nom}" a bien été modifié.`
      });
      toast({
        title: `Modification réussie`,
        description: `Le médicament "${values.nom}" a bien été modifié.`
      });
    });
    setIsEditDialogOpen(false);
  }

  function handleDeleteMedication(id: string) {
    const med = medicationsList.find((m) => m.medicament_id === id);
    deleteMedication(id).then(() => {
      setMedicationsList((list) => list.filter(m => m.medicament_id !== id));
      addNotification({
        type: 'success',
        title: `Suppression réussie`,
        description: `Le médicament "${med?.nom || ''}" a bien été supprimé.`
      });
      toast({
        title: `Suppression réussie`,
        description: `Le médicament "${med?.nom || ''}" a bien été supprimé.`
      });
    });
    setMedicationToDelete(null);
  }

  const handleEditClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 gap-6">
        <div className="flex items-center">
          <Pill className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">Médicaments</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un médicament
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un médicament</DialogTitle>
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
      <AlertDialog open={!!medicationToDelete} onOpenChange={(open: boolean) => !open && setMedicationToDelete(null)}>
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