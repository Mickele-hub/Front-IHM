import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StockStatusBadgeProps {
  stock: number;
  lowThreshold?: number;
  criticalThreshold?: number;
}

export function StockStatusBadge({
  stock,
  lowThreshold = 20,
  criticalThreshold = 10,
}: StockStatusBadgeProps) {
  if (stock <= criticalThreshold) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800">
        Critique
      </Badge>
    );
  } else if (stock <= lowThreshold) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
        Faible
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
        Bon
      </Badge>
    );
  }
}