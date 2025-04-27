// API utility functions for CRUD operations
import { Supplier, Medication, StockMovement } from "@/types";

const API_BASE = "http://localhost:3000";

// --- FOURNISSEURS ---
export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${API_BASE}/fournisseurs`);
  return res.json();
}
export async function addSupplier(data: Omit<Supplier, "fournisseur_id"|"created_at">): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/fournisseurs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/fournisseurs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function deleteSupplier(id: string): Promise<void> {
  await fetch(`${API_BASE}/fournisseurs/${id}`, { method: "DELETE" });
}

// --- MEDICAMENTS ---
export async function getMedications(): Promise<Medication[]> {
  const res = await fetch(`${API_BASE}/medicaments`);
  return res.json();
}
export async function addMedication(data: Omit<Medication, "medicament_id"|"created_at">): Promise<Medication> {
  const res = await fetch(`${API_BASE}/medicaments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateMedication(id: string, data: Partial<Medication>): Promise<Medication> {
  const res = await fetch(`${API_BASE}/medicaments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function deleteMedication(id: string): Promise<void> {
  await fetch(`${API_BASE}/medicaments/${id}`, { method: "DELETE" });
}

// --- MOUVEMENTS DE STOCK ---
export async function getStockMovements(): Promise<StockMovement[]> {
  const res = await fetch(`${API_BASE}/mouvementstocks`);
  return res.json();
}
export async function addStockMovement(data: Omit<StockMovement, "mouvement_id">): Promise<StockMovement> {
  const res = await fetch(`${API_BASE}/mouvementstocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateStockMovement(id: string, data: Partial<StockMovement>): Promise<StockMovement> {
  const res = await fetch(`${API_BASE}/mouvementstocks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function deleteStockMovement(id: string): Promise<void> {
  await fetch(`${API_BASE}/mouvementstocks/${id}`, { method: "DELETE" });
}
