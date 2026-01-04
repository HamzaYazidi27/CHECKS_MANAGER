import { Check, ChecksState } from '@/types';
import { notificationService } from '@/utils/notifications';
import { checksStorage } from '@/utils/storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface ChecksContextType extends ChecksState {
  addCheck: (checkData: Omit<Check, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<Check>;
  updateCheck: (checkId: string, updates: Partial<Check>) => Promise<Check>;
  deleteCheck: (checkId: string) => Promise<void>;
  refreshChecks: () => Promise<void>;
  markAsCashed: (checkId: string) => Promise<Check>;
  upcomingChecks: () => Check[];
  dueChecks: () => Check[];
  cashedChecks: () => Check[];
}

const ChecksContext = createContext<ChecksContextType | undefined>(undefined);

export const ChecksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<ChecksState>({
    checks: [],
    loading: false,
    error: null,
  });

  // Charger les chèques au démarrage ou quand l'utilisateur change
  const refreshChecks = useCallback(async () => {
    if (!user?.id) {
      setState({ checks: [], loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    try {
      // Mettre à jour les statuts d'abord
      await checksStorage.updateAllCheckStatuses(user.id);
      // Puis récupérer les chèques
      const checks = await checksStorage.getChecks(user.id);
      
      // Re-synchroniser les rappels des chèques (reprogrammer ceux manquants)
      await notificationService.reSyncCheckReminders(checks);
      
      setState({
        checks,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors du chargement des chèques',
      }));
    }
  }, [user?.id]);

  useEffect(() => {
    refreshChecks();
  }, [user?.id, refreshChecks]);

  const addCheck = async (checkData: Omit<Check, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user?.id) throw new Error('Utilisateur non authentifié');

    try {
      const newCheck = await checksStorage.addCheck(user.id, checkData);
      
      // Programmer la notification 48h avant l'expiration
      const notificationId = await notificationService.scheduleCheckReminder(
        newCheck.id,
        newCheck.dueDate,
        newCheck.beneficiary
      );
      
      // Mettre à jour le chèque avec l'ID de notification
      if (notificationId) {
        const updatedCheck = await checksStorage.updateCheck(newCheck.id, {
          notificationId,
        });
        setState(prev => ({
          ...prev,
          checks: [...prev.checks, updatedCheck],
        }));
        return updatedCheck;
      }
      
      setState(prev => ({
        ...prev,
        checks: [...prev.checks, newCheck],
      }));
      return newCheck;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erreur lors de l\'ajout du chèque',
      }));
      throw error;
    }
  };

  const updateCheck = async (checkId: string, updates: Partial<Check>) => {
    try {
      const updated = await checksStorage.updateCheck(checkId, updates);
      setState(prev => ({
        ...prev,
        checks: prev.checks.map(c => (c.id === checkId ? updated : c)),
      }));
      return updated;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erreur lors de la mise à jour du chèque',
      }));
      throw error;
    }
  };

  const deleteCheck = async (checkId: string) => {
    try {
      // Récupérer le chèque pour obtenir l'ID de notification
      const check = state.checks.find(c => c.id === checkId);
      if (check?.notificationId) {
        await notificationService.cancelNotification(check.notificationId);
      }
      
      await checksStorage.deleteCheck(checkId);
      setState(prev => ({
        ...prev,
        checks: prev.checks.filter(c => c.id !== checkId),
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erreur lors de la suppression du chèque',
      }));
      throw error;
    }
  };

  const markAsCashed = async (checkId: string) => {
    // Récupérer le chèque pour obtenir l'ID de notification
    const check = state.checks.find(c => c.id === checkId);
    if (check?.notificationId) {
      await notificationService.cancelNotification(check.notificationId);
    }
    return updateCheck(checkId, { status: 'cashed' as any });
  };

  const upcomingChecks = useCallback(() => {
    return state.checks.filter(c => c.status === 'upcoming').sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [state.checks]);

  const dueChecks = useCallback(() => {
    return state.checks.filter(c => c.status === 'due').sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [state.checks]);

  const cashedChecks = useCallback(() => {
    return state.checks.filter(c => c.status === 'cashed').sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [state.checks]);

  return (
    <ChecksContext.Provider
      value={{
        ...state,
        addCheck,
        updateCheck,
        deleteCheck,
        refreshChecks,
        markAsCashed,
        upcomingChecks,
        dueChecks,
        cashedChecks,
      }}
    >
      {children}
    </ChecksContext.Provider>
  );
};

export const useChecks = () => {
  const context = useContext(ChecksContext);
  if (undefined === context) {
    throw new Error('useChecks doit être utilisé à l\'intérieur d\'un ChecksProvider');
  }
  return context;
};
