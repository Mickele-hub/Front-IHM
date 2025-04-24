"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StockMovementForm } from "@/components/ui/stock-movement-form";
import { StockMovement } from "@/types";
import { Badge } from "@/components/ui/badge";
import { stockMovements, getMedicationById, getStockMovementsWithNames } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MouvementsPage() {
  const [movementsList, setMovementsList] = useState<StockMovement[]>(getStockMovementsWithNames());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const columns = [
    {
      accessorKey: "medicament_nom",
      header: "Médicament",
    },
    {
      accessorKey: "type_mouvement",
      header: "Type",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
        return format(new Date(row.original.date_mouvement), "dd/MM/yyyy HH:mm", { locale: fr });
      },
    },
  ];

  const handleAddMovement = (values: any) => {
    const medication = getMedicationById(values.medicament_id);
    
    const newMovement: StockMovement = {
      mouvement_id: `mv${Math.floor(Math.random() * 10000)}`,
      medicament_id: values.medicament_id,
      medicament_nom: medication?.nom || "Inconnu",
      type_mouvement: values.type_mouvement,
      quantite: values.quantite,
      date_mouvement: values.date_mouvement.toISOString(),
    };
    
    setMovementsList([newMovement, ...movementsList]);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PackageSearch className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold tracking-tight">Mouvements de stock</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
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
            searchColumn="medicament_nom"
            searchPlaceholder="Rechercher un médicament..."
          />
        </CardContent>
      </Card>
    </div>
  );
}