import * as Notifications from 'expo-notifications';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  /**
   * Demander la permission pour les notifications
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erreur demande permission notifications:', error);
      return false;
    }
  },

  /**
   * Programmer une notification locale
   * @param title - Titre de la notification
   * @param body - Corps du message
   * @param delay - Délai en secondes avant affichage
   * @param data - Données additionnelles
   */
  async scheduleNotification(
    title: string,
    body: string,
    delay: number,
    data?: Record<string, any>
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
          badge: 1,
          priority: 'high' as const,
        },
        trigger: {
          seconds: Math.max(1, delay),
        } as any,
      });

      console.log('Notification programmée:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Erreur programmation notification:', error);
      return null;
    }
  },

  /**
   * Programmer une notification pour 48h avant l'expiration d'un chèque
   * @param checkId - ID du chèque
   * @param dueDate - Date d'expiration du chèque (YYYY-MM-DD)
   * @param beneficiary - Bénéficiaire du chèque
   */
  async scheduleCheckReminder(
    checkId: string,
    dueDate: string,
    beneficiary: string
  ): Promise<string | null> {
    try {
      const dueDateObj = new Date(dueDate);
      const reminderDate = new Date(dueDateObj.getTime() - 48 * 60 * 60 * 1000); // 48h avant
      const now = new Date();

      // Si la date de rappel est dans le passé, ne pas programmer
      if (reminderDate <= now) {
        console.log('Date de rappel dans le passé, notification non programmée');
        return null;
      }

      const delaySeconds = Math.floor(
        (reminderDate.getTime() - now.getTime()) / 1000
      );

      const notificationId = await this.scheduleNotification(
        '⏰ Rappel - Chèque à finaliser',
        `Le chèque de ${beneficiary} expire dans 48 heures (${dueDate})`,
        delaySeconds,
        {
          checkId,
          dueDate,
          type: 'checkReminder',
        }
      );

      return notificationId;
    } catch (error) {
      console.error('Erreur programmation rappel chèque:', error);
      return null;
    }
  },

  /**
   * Annuler une notification programmée
   * @param notificationId - ID de la notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification annulée:', notificationId);
    } catch (error) {
      console.error('Erreur annulation notification:', error);
    }
  },

  /**
   * Annuler toutes les notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Toutes les notifications annulées');
    } catch (error) {
      console.error('Erreur annulation toutes les notifications:', error);
    }
  },

  /**
   * Obtenir toutes les notifications programmées
   */
  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  },

  /**
   * Écouter les notifications reçues
   * @param callback - Fonction appelée quand une notification arrive
   */
  onNotificationReceived(
    callback: (notification: Notifications.Notification) => void
  ): void {
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        callback(response.notification);
      });

    // Note: subscription.remove() peut être appelé pour se désabonner
  },

  /**
   * Re-synchroniser les rappels des chèques (rapprogrammer ceux qui manquent)
   * @param checks - Liste des chèques
   */
  async reSyncCheckReminders(
    checks: any[]
  ): Promise<void> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const scheduledCheckIds = new Set(
        scheduledNotifications
          .filter(n => n.content.data?.type === 'checkReminder')
          .map(n => n.content.data?.checkId)
      );

      // Pour chaque chèque, vérifier si un rappel est programmé
      for (const check of checks) {
        // Ignorer les chèques déjà encaissés
        if (check.status === 'cashed') {
          continue;
        }

        // Si le rappel n'existe pas, le programmer
        if (!scheduledCheckIds.has(check.id)) {
          await this.scheduleCheckReminder(
            check.id,
            check.dueDate,
            check.beneficiary
          );
        }
      }
    } catch (error) {
      console.error('Erreur resync rappels:', error);
    }
  },

  /**
   * Tester une notification immédiate
   * @param title - Titre du test
   * @param body - Corps du message
   */
  async sendTestNotification(title: string, body: string): Promise<void> {
    try {
      await this.scheduleNotification(title, body, 2);
    } catch (error) {
      console.error('Erreur notification test:', error);
    }
  },
};
