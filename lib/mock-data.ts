import { Medication, Supplier, StockMovement } from "@/types";

// Mock suppliers data
export const suppliers: Supplier[] = [
  {
    fournisseur_id: "f001",
    nom: "PharmaPlus Distribution",
    telephone: "+33 1 23 45 67 89",
    adresse: "15 Rue des Pharmaciens, 75001 Paris",
    email: "contact@pharmaplusdistribution.fr",
    created_at: "2023-01-15T09:30:00Z",
  },
  {
    fournisseur_id: "f002",
    nom: "MediSource International",
    telephone: "+33 1 23 45 67 90",
    adresse: "27 Avenue de la Médecine, 69002 Lyon",
    email: "info@medisource.com",
    created_at: "2023-02-10T14:15:00Z",
  },
  {
    fournisseur_id: "f003",
    nom: "BioPharm Solutions",
    telephone: "+33 1 23 45 67 91",
    adresse: "8 Boulevard Pasteur, 33000 Bordeaux",
    email: "contact@biopharm.fr",
    created_at: "2023-03-22T11:45:00Z",
  },
  {
    fournisseur_id: "f004",
    nom: "HealthCare Distributors",
    telephone: "+33 1 23 45 67 92",
    adresse: "45 Rue Nationale, 13001 Marseille",
    email: "service@healthcaredist.fr",
    created_at: "2023-04-05T10:00:00Z",
  },
  {
    fournisseur_id: "f005",
    nom: "EuroMed Supply",
    telephone: "+33 1 23 45 67 93",
    adresse: "12 Rue Victor Hugo, 59000 Lille",
    email: "info@euromedsupply.eu",
    created_at: "2023-05-18T16:30:00Z",
  },
];

// Mock medications data
export const medications: Medication[] = [
  {
    medicament_id: "m001",
    nom: "Paracétamol 500mg",
    reference: "PCM500",
    categorie: "Analgésique",
    stock: 350,
    date_expiration: "2025-07-15",
    prix: 2.99,
    fournisseur_id: "f001",
    created_at: "2023-01-20T10:15:00Z",
  },
  {
    medicament_id: "m002",
    nom: "Amoxicilline 1g",
    reference: "AMX1000",
    categorie: "Antibiotique",
    stock: 120,
    date_expiration: "2024-12-30",
    prix: 8.50,
    fournisseur_id: "f002",
    created_at: "2023-02-15T14:30:00Z",
  },
  {
    medicament_id: "m003",
    nom: "Ibuprofène 400mg",
    reference: "IBP400",
    categorie: "Anti-inflammatoire",
    stock: 200,
    date_expiration: "2025-05-10",
    prix: 3.75,
    fournisseur_id: "f001",
    created_at: "2023-03-10T09:45:00Z",
  },
  {
    medicament_id: "m004",
    nom: "Oméprazole 20mg",
    reference: "OMP020",
    categorie: "Antiulcéreux",
    stock: 80,
    date_expiration: "2024-09-22",
    prix: 5.25,
    fournisseur_id: "f003",
    created_at: "2023-04-05T11:20:00Z",
  },
  {
    medicament_id: "m005",
    nom: "Loratadine 10mg",
    reference: "LRT010",
    categorie: "Antihistaminique",
    stock: 15,
    date_expiration: "2025-03-18",
    prix: 4.20,
    fournisseur_id: "f004",
    created_at: "2023-05-12T15:10:00Z",
  },
  {
    medicament_id: "m006",
    nom: "Metformine 850mg",
    reference: "MTF850",
    categorie: "Antidiabétique",
    stock: 150,
    date_expiration: "2025-08-05",
    prix: 6.80,
    fournisseur_id: "f002",
    created_at: "2023-06-08T13:40:00Z",
  },
  {
    medicament_id: "m007",
    nom: "Amlodipine 5mg",
    reference: "AML005",
    categorie: "Antihypertenseur",
    stock: 9,
    date_expiration: "2024-11-15",
    prix: 7.30,
    fournisseur_id: "f003",
    created_at: "2023-07-20T10:30:00Z",
  },
  {
    medicament_id: "m008",
    nom: "Fluoxétine 20mg",
    reference: "FLX020",
    categorie: "Antidépresseur",
    stock: 100,
    date_expiration: "2025-02-28",
    prix: 9.50,
    fournisseur_id: "f005",
    created_at: "2023-08-15T16:15:00Z",
  },
];

// Mock stock movements data
export const stockMovements: StockMovement[] = [
  {
    mouvement_id: "mv001",
    medicament_id: "m001",
    type_mouvement: "entrée",
    quantite: 100,
    date_mouvement: "2023-09-05T14:30:00Z",
  },
  {
    mouvement_id: "mv002",
    medicament_id: "m002",
    type_mouvement: "sortie",
    quantite: 30,
    date_mouvement: "2023-09-06T10:15:00Z",
  },
  {
    mouvement_id: "mv003",
    medicament_id: "m003",
    type_mouvement: "entrée",
    quantite: 50,
    date_mouvement: "2023-09-07T16:45:00Z",
  },
  {
    mouvement_id: "mv004",
    medicament_id: "m004",
    type_mouvement: "sortie",
    quantite: 20,
    date_mouvement: "2023-09-08T09:30:00Z",
  },
  {
    mouvement_id: "mv005",
    medicament_id: "m001",
    type_mouvement: "sortie",
    quantite: 25,
    date_mouvement: "2023-09-09T11:20:00Z",
  },
  {
    mouvement_id: "mv006",
    medicament_id: "m005",
    type_mouvement: "entrée",
    quantite: 15,
    date_mouvement: "2023-09-10T13:10:00Z",
  },
  {
    mouvement_id: "mv007",
    medicament_id: "m006",
    type_mouvement: "sortie",
    quantite: 10,
    date_mouvement: "2023-09-11T15:45:00Z",
  },
  {
    mouvement_id: "mv008",
    medicament_id: "m007",
    type_mouvement: "entrée",
    quantite: 30,
    date_mouvement: "2023-09-12T10:00:00Z",
  },
  {
    mouvement_id: "mv009",
    medicament_id: "m008",
    type_mouvement: "sortie",
    quantite: 5,
    date_mouvement: "2023-09-13T14:20:00Z",
  },
  {
    mouvement_id: "mv010",
    medicament_id: "m002",
    type_mouvement: "entrée",
    quantite: 40,
    date_mouvement: "2023-09-14T16:30:00Z",
  },
];

// Helper functions for data manipulation and statistics

export function getSupplierById(id: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.fournisseur_id === id);
}

export function getMedicationById(id: string): Medication | undefined {
  return medications.find((medication) => medication.medicament_id === id);
}

export function getLowStockMedications(threshold: number = 20): Medication[] {
  return medications.filter((medication) => medication.stock <= threshold);
}

export function getExpiringMedications(daysThreshold: number = 90): Medication[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return medications.filter((medication) => {
    const expiryDate = new Date(medication.date_expiration);
    return expiryDate <= thresholdDate;
  });
}

export function getStockMovementsWithNames(): (StockMovement & { medicament_nom: string })[] {
  return stockMovements.map((movement) => {
    const medication = getMedicationById(movement.medicament_id);
    return {
      ...movement,
      medicament_nom: medication?.nom || "Inconnu",
    };
  });
}

export function getRecentStockMovements(count: number = 5): (StockMovement & { medicament_nom: string })[] {
  const movementsWithNames = getStockMovementsWithNames();
  return movementsWithNames
    .sort((a, b) => new Date(b.date_mouvement).getTime() - new Date(a.date_mouvement).getTime())
    .slice(0, count);
}

export function getDashboardStats(): { 
  totalMedications: number;
  totalSuppliers: number;
  totalMovements: number;
  lowStockCount: number;
  expiringCount: number;
  stockValue: number;
} {
  return {
    totalMedications: medications.length,
    totalSuppliers: suppliers.length,
    totalMovements: stockMovements.length,
    lowStockCount: getLowStockMedications().length,
    expiringCount: getExpiringMedications().length,
    stockValue: medications.reduce((total, med) => total + (med.prix * med.stock), 0),
  };
}

export function getTopCategories(): { categorie: string; count: number }[] {
  const categories: Record<string, number> = {};
  
  medications.forEach((med) => {
    categories[med.categorie] = (categories[med.categorie] || 0) + 1;
  });
  
  return Object.entries(categories)
    .map(([categorie, count]) => ({ categorie, count }))
    .sort((a, b) => b.count - a.count);
}