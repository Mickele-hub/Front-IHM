"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StockMovementForm } from "@/components/ui/stock-movement-form";
import { StockMovement, Medication } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getStockMovements, addStockMovement, updateStockMovement, deleteStockMovement, getMedications } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications } from '@/context/notifications-context';
import { toast } from '@/hooks/use-toast';

export default function MouvementsPage() {
  const { addNotification } = useNotifications();
  const [movementsList, setMovementsList] = useState<StockMovement[]>([]);
  const [medicationsList, setMedicationsList] = useState<Medication[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    getStockMovements().then(setMovementsList);
    getMedications().then(setMedicationsList);
  }, []);

  const columns = [
    {
      accessorKey: "medicament_nom",
      header: "Médicament",
      cell: ({ row }: { row: { original: StockMovement } }) =>
        row.original.medicament?.nom ||
        medicationsList.find(m => String(m.medicament_id) === String(row.original.medicament_id))?.nom ||
        "-",
    },
    {
      accessorKey: "type_mouvement",
      header: "Type",
      cell: ({ row }: { row: { original: StockMovement } }) => {
        const type = row.original.type_mouvement;
        return (
          <div className="flex items-center">
            {type === "entrée" ? (
              <>
                <ArrowUpRight className="h-4 w-4 mr-2 text-emerald-500" />
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                  Entrée
                </Badge>
              </>
            ) : (
              <>
                <ArrowDownLeft className="h-4 w-4 mr-2 text-rose-500" />
                <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">
                  Sortie
                </Badge>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "quantite",
      header: "Quantité",
    },
    {
      accessorKey: "date_mouvement",
      header: "Date",
      cell: ({ row }: { row: { original: StockMovement } }) => {
        const rawDate = row.original.date_mouvement;
        const date = rawDate ? new Date(rawDate) : null;
        return date && !isNaN(date.getTime())
          ? format(date, "dd/MM/yyyy HH:mm", { locale: fr })
          : "-";
      },
    },
  ];

  function handleAddMovement(values: { medicament_id: string; type_mouvement: "entrée" | "sortie"; quantite: number; date_mouvement: Date; }) {
    const payload = {
      ...values,
      date_mouvement: values.date_mouvement.toISOString(),
    };
    addStockMovement(payload as Omit<StockMovement, "mouvement_id">).then((newMovement) => {
      setMovementsList((list) => [...list, newMovement]);
      const medName = newMovement.medicament?.nom ||
        medicationsList.find(m => String(m.medicament_id) === String(newMovement.medicament_id))?.nom ||
        '';
      toast({
        title: `Mouvement de stock enregistré !`,
        description: `Une ${newMovement.type_mouvement === 'entrée' ? 'entrée' : 'sortie'} de ${newMovement.quantite} unité(s) pour le médicament ${medName} a été enregistrée.`,
        variant: newMovement.type_mouvement === 'entrée' ? undefined : 'destructive',
      });
      addNotification({
        type: "mouvement",
        title: `Mouvement de stock (${newMovement.type_mouvement === 'entrée' ? 'Entrée' : 'Sortie'})`,
        description: `${newMovement.type_mouvement === 'entrée' ? 'Entrée' : 'Sortie'} de ${newMovement.quantite} unité(s) pour le médicament ${medName}`,
      });
      getStockMovements().then(setMovementsList);
    });
    setIsAddDialogOpen(false);
  }

  function handleEditMovement(id: string, values: { medicament_id: string; type_mouvement: "entrée" | "sortie"; quantite: number; date_mouvement: Date; }) {
    const payload = {
      ...values,
      date_mouvement: values.date_mouvement.toISOString(),
    };
    updateStockMovement(id, payload as Partial<StockMovement>).then((updated) => setMovementsList((list) => list.map(m => m.mouvement_id === id ? updated : m)));
    setIsAddDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 gap-6">
        <div className="flex items-center">
          <PackageSearch className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">Mouvements de stock</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2 gap-2" />
              Nouveau mouvement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enregistrer un mouvement de stock</DialogTitle>
            </DialogHeader>
            <StockMovementForm
              onSubmit={handleAddMovement}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des mouvements</CardTitle>
          <CardDescription>
            Consultez l'historique des entrées et sorties de médicaments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={movementsList}
          />
        </CardContent>
      </Card>
    </div>
  );
}