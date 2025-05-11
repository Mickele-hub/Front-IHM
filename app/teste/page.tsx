"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pill as Pills,
  PackageSearch,
  TruckIcon,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { StockCard } from "@/components/stock-card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { getMedications, getSuppliers, getStockMovements } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StockStatusBadge } from "@/components/stock-status-badge";

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [recentMovements, setRecentMovements] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Récupère toutes les données réelles de la base
      const [meds, sups, mouvements] = await Promise.all([
        getMedications(),
        getSuppliers(),
        getStockMovements()
      ]);
      // Exemples de stats logiques
      setStats({
        totalMedications: meds.length,
        totalSuppliers: sups.length,
        totalMovements: mouvements.length,
        lowStockCount: meds.filter(m => m.stock < 10).length,
        stockValue: meds.reduce((total, med) => total + (Number(med.prix) * Number(med.stock)), 0),
        allMedications: meds
      });
      setLowStock(meds.filter(m => m.stock < 10));
      setRecentMovements(mouvements.slice(-5).reverse());
      // Ajoute ici d'autres calculs selon tes besoins
    }
    fetchData();
  }, []);

  const lowStockColumns = [
    {
      accessorKey: "nom",
      header: "Médicament",
    },
    {
      accessorKey: "reference",
      header: "Référence",
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }: { row: any }) => {
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
      accessorKey: "prix",
      header: "Prix (€)",
      cell: ({ row }: { row: any }) => {
        const prix = Number(row.original.prix);
        return <div>{!isNaN(prix) ? prix.toFixed(2) : '-'} €</div>;
      },
    },
  ];

  const recentMovementsColumns = [
    {
      accessorKey: "medicament_nom",
      header: "Médicament",
    },
    {
      accessorKey: "type_mouvement",
      header: "Type",
      cell: ({ row }: { row: any }) => {
        return (
          <Badge
            variant={
              row.original.type_mouvement === "entrée" ? "default" : "secondary"
            }
          >
            {row.original.type_mouvement}
          </Badge>
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
      cell: ({ row }: { row: any }) => {
        return format(new Date(row.original.date_mouvement), "dd/MM/yyyy", {
          locale: fr,
        });
      },
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Génère dynamiquement les données pour les graphiques
  const stockMovementData = Array.from({ length: 6 }).map((_, i) => {
    // Calcule le mois (0 = janvier)
    const month = new Date().getMonth() - 5 + i;
    const year = new Date().getFullYear();
    const monthDate = new Date(year, month, 1);
    const name = monthDate.toLocaleString('fr-FR', { month: 'short' });
    // Filtre les mouvements du mois
    const mouvementsMois = recentMovements.filter(mov => {
      const movDate = new Date(mov.date_mouvement);
      return movDate.getMonth() === monthDate.getMonth() && movDate.getFullYear() === monthDate.getFullYear();
    });
    return {
      name,
      entrées: mouvementsMois.filter(m => m.type_mouvement === 'entrée').reduce((acc, m) => acc + Number(m.quantite), 0),
      sorties: mouvementsMois.filter(m => m.type_mouvement === 'sortie').reduce((acc, m) => acc + Number(m.quantite), 0),
    };
  });

  // Catégories dynamiques : total de stock par catégorie (TOUS les médicaments)
  const categoryData = Array.isArray(stats) ? [] :
    (stats && Array.isArray(stats.allMedications) && stats.allMedications[0]?.categorie
      ? Object.entries(
          stats.allMedications.reduce((acc: Record<string, number>, med: any) => {
            acc[med.categorie] = (acc[med.categorie] || 0) + Number(med.stock || 0);
            return acc;
          }, {} as Record<string, number>)
        ).map(([categorie, value]) => ({ name: categorie, value }))
      : []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(), "dd MMMM yyyy", { locale: fr })}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StockCard
          title="Médicaments"
          value={stats?.totalMedications}
          icon={Pills}
          className="bg-blue-50 dark:bg-blue-950/30"
        />
        <StockCard
          title="Fournisseurs"
          value={stats?.totalSuppliers}
          icon={TruckIcon}
          className="bg-green-50 dark:bg-green-950/30"
        />
        <StockCard
          title="Stock critique"
          value={stats?.lowStockCount}
          icon={AlertCircle}
          className="bg-amber-50 dark:bg-amber-950/30"
        />
        <StockCard
          title="Valeur du stock"
          value={`${stats?.stockValue?.toFixed(2)} €`}
          icon={DollarSign}
          className="bg-indigo-50 dark:bg-indigo-950/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Mouvements de stock</CardTitle>
            <CardDescription>
              Entrées et sorties de stock sur les 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockMovementData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entrées" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="sorties" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>
              Nombre de médicaments par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
}
