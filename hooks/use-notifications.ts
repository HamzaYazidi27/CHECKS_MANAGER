import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

/**
 * Hook pour écouter les notifications
 * @param callback - Fonction appelée quand une notification est cliquée
 */
export const useNotificationListener = (
  callback?: (notification: Notifications.Notification) => void
) => {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (callback) {
          callback(response.notification);
        }
        // Vous pouvez aussi traiter les données de la notification ici
        const data = response.notification.request.content.data;
        console.log('Notification cliquée:', data);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [callback]);
};

/**
 * Hook pour écouter les notifications reçues en arrière-plan
 */
export const useNotificationListener2 = (
  callback?: (notification: Notifications.Notification) => void
) => {
  useEffect(() => {
    // Écouter les notifications reçues (même si l'app est active)
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (callback) {
          callback(notification);
        }
        console.log('Notification reçue:', notification.request.content.data);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [callback]);
};
