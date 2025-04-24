"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DivideIcon as LucideIcon } from "lucide-react";

interface StockCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}


export function StockCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StockCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
      {trend && trendValue && (
        <CardFooter>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-normal",
              trend === "up" && "text-emerald-500 dark:text-emerald-400", 
              trend === "down" && "text-rose-500 dark:text-rose-400"
            )}
          >
            {trendValue}
          </Badge>
        </CardFooter>
      )}
    </Card>
  );
}