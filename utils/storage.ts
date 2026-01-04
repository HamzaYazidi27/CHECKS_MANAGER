import { Check, CheckStatus, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'checks_users';
const CHECKS_KEY = 'checks_data';
const AUTH_KEY = 'checks_auth';

// ============================================
// 🔐 GESTION D'AUTHENTIFICATION
// ============================================

export const authStorage = {
  // Inscription
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const users = await this.getAllUsers();
      
      if (users.some(u => u.email === email)) {
        throw new Error('Cet email est déjà utilisé');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  async login(email: string, password: string): Promise<User> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Validation simplifiée du mot de passe
      // En production: utiliser un backend avec bcrypt
      if (user.email !== email) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Sauvegarder l'utilisateur connecté
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer l'utilisateur connecté
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(AUTH_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
    } catch (error) {
      throw error;
    }
  },

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  },
};

// ============================================
// 📋 GESTION DES CHÈQUES
// ============================================

export const checksStorage = {
  // Récupérer tous les chèques de l'utilisateur
  async getChecks(userId: string): Promise<Check[]> {
    try {
      const allChecks = await AsyncStorage.getItem(CHECKS_KEY);
      const checks: Check[] = allChecks ? JSON.parse(allChecks) : [];
      return checks.filter(check => check.userId === userId);
    } catch (error) {
      console.error('Erreur lors de la récupération des chèques:', error);
      return [];
    }
  },

  // Ajouter un chèque
  async addCheck(userId: string, checkData: Omit<Check, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Check> {
    try {
      const allChecks = await AsyncStorage.getItem(CHECKS_KEY);
      const checks: any[] = allChecks ? JSON.parse(allChecks) : [];

      const newCheck: any = {
        id: Date.now().toString(),
        userId,
        ...checkData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      checks.push(newCheck);
      await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
      
      return newCheck;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un chèque
  async updateCheck(checkId: string, updates: Partial<Check>): Promise<Check> {
    try {
      const allChecks = await AsyncStorage.getItem(CHECKS_KEY);
      const checks: any[] = allChecks ? JSON.parse(allChecks) : [];

      const index = checks.findIndex(c => c.id === checkId);
      if (index === -1) {
        throw new Error('Chèque non trouvé');
      }

      checks[index] = {
        ...checks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
      return checks[index];
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un chèque
  async deleteCheck(checkId: string): Promise<void> {
    try {
      const allChecks = await AsyncStorage.getItem(CHECKS_KEY);
      const checks: any[] = allChecks ? JSON.parse(allChecks) : [];

      const filtered = checks.filter(c => c.id !== checkId);
      await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      throw error;
    }
  },

  // Déterminer le statut du chèque
  getCheckStatus(dueDate: string, currentStatus: CheckStatus): CheckStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    // Si déjà encaissé, garder ce statut
    if (currentStatus === CheckStatus.CASHED) {
      return CheckStatus.CASHED;
    }

    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return CheckStatus.DUE; // En retard
    } else if (daysUntilDue === 0) {
      return CheckStatus.DUE; // Aujourd'hui
    } else if (daysUntilDue <= 7) {
      return CheckStatus.UPCOMING; // Dans les 7 prochains jours
    } else {
      return CheckStatus.PENDING; // Plus tard
    }
  },

  // Mettre à jour les statuts de tous les chèques
  async updateAllCheckStatuses(userId: string): Promise<void> {
    try {
      const checks = await this.getChecks(userId);
      const allChecks = await AsyncStorage.getItem(CHECKS_KEY);
      const allChecksArray: any[] = allChecks ? JSON.parse(allChecks) : [];

      for (const check of checks) {
        const newStatus = this.getCheckStatus(check.dueDate, check.status);
        const index = allChecksArray.findIndex(c => c.id === check.id);
        if (index !== -1) {
          allChecksArray[index].status = newStatus;
        }
      }

      await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(allChecksArray));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statuts:', error);
    }
  },
};
