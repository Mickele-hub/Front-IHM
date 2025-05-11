// types.ts

export interface Supplier {
  fournisseur_id: string;
  name: string;
  contact: string;
  address: string;
  created_at: string;
}

export interface Medication {
  medicament_id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  created_at: string;
}

export interface StockMovement {
  mouvement_id: string;
  medicament_id: string;
  quantity: number;
  type: "IN" | "OUT"; // Exemple de type de mouvement (entrée ou sortie)
  created_at: string;
}
