// Helper pour les tests - Données de test
import { Check, CheckStatus, User } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Jean Dupont',
  createdAt: new Date().toISOString(),
};

export const mockChecks: Check[] = [
  {
    id: '1',
    userId: '1',
    amount: 1500.00,
    beneficiary: 'Entreprise ABC SARL',
    checkNumber: '123456',
    depositDate: '2026-01-04',
    dueDate: '2026-01-15',
    status: CheckStatus.UPCOMING,
    notes: 'Paiement facture 001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    amount: 2000.00,
    beneficiary: 'Fournisseur XYZ',
    checkNumber: '654321',
    depositDate: '2026-01-01',
    dueDate: '2026-01-08',
    status: CheckStatus.DUE,
    notes: 'Urgence',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    amount: 500.00,
    beneficiary: 'Service Client',
    depositDate: '2025-12-20',
    dueDate: '2026-02-15',
    status: CheckStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    userId: '1',
    amount: 3000.00,
    beneficiary: 'Partenaire Commercial',
    checkNumber: '111111',
    depositDate: '2025-12-15',
    dueDate: '2025-12-31',
    status: CheckStatus.CASHED,
    notes: 'Déjà encaissé',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
