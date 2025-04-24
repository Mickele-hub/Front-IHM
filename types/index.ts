export interface Supplier {
  fournisseur_id: string;
  nom: string;
  telephone: string;
  adresse: string;
  email: string;
  created_at: string;
}

export interface Medication {
  medicament_id: string;
  nom: string;
  reference: string;
  categorie: string;
  stock: number;
  date_expiration: string;
  prix: number;
  fournisseur_id: string;
  created_at: string;
}

export interface StockMovement {
  mouvement_id: string;
  medicament_id: string;
  medicament_nom?: string;
  type_mouvement: 'entrée' | 'sortie';
  quantite: number;
  date_mouvement: string;
}

export interface DashboardStats {
  totalMedications: number;
  totalSuppliers: number;
  totalMovements: number;
  lowStockCount: number;
  expiringCount: number;
}