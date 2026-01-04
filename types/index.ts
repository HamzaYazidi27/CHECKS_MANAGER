// Types pour l'application de gestion des chèques

export enum CheckStatus {
  PENDING = 'pending', // En attente
  UPCOMING = 'upcoming', // À encaisser bientôt (< 7 jours)
  DUE = 'due', // À encaisser (aujourd'hui ou passé)
  CASHED = 'cashed', // Encaissé
}

export interface Check {
  id: string;
  userId: string;
  amount: number;
  beneficiary: string;
  checkNumber?: string;
  depositDate: string; // Format: YYYY-MM-DD
  dueDate: string; // Format: YYYY-MM-DD
  status: CheckStatus;
  notes?: string;
  notificationId?: string; // ID de la notification programmée (48h avant)
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ChecksState {
  checks: Check[];
  loading: boolean;
  error: string | null;
}
