# 🔔 Système de Notifications Push - CHECKS

## Vue d'ensemble

L'application CHECKS inclut un système de notifications push intégré qui rappelle aux utilisateurs de finaliser leurs chèques 48 heures avant la date d'expiration.

## ✨ Fonctionnalités

### ✅ Rappels Automatiques 48h Avant Expiration
- Une notification est programmée automatiquement lors de l'ajout d'un chèque
- L'utilisateur reçoit un rappel 48 heures avant la date d'expiration du chèque
- La notification contient des informations essentielles:
  - Nom du bénéficiaire
  - Date d'expiration du chèque
  - ID du chèque (pour traçabilité)

### ✅ Gestion des Notifications
- Annulation automatique lors de la suppression d'un chèque
- Annulation automatique lors du marquage comme "encaissé"
- Stockage de l'ID de notification pour suivi

### ✅ Permission Utilisateur
- Demande de permission au démarrage de l'app
- Gestion gracieuse si l'utilisateur refuse les permissions

## 🏗️ Architecture

### Services

#### `utils/notifications.ts` - Service de Notifications
Service centralisé pour gérer toutes les opérations de notification.

**Fonctions principales:**
```typescript
// Demander les permissions
await notificationService.requestPermissions();

// Programmer une notification générique
await notificationService.scheduleNotification(
  'Titre',
  'Message',
  delayInSeconds,
  { customData: 'value' }
);

// Programmer un rappel de chèque (48h avant)
await notificationService.scheduleCheckReminder(
  checkId,
  'YYYY-MM-DD',
  'Bénéficiaire'
);

// Annuler une notification
await notificationService.cancelNotification(notificationId);

// Annuler toutes les notifications
await notificationService.cancelAllNotifications();

// Récupérer les notifications programmées
const scheduled = await notificationService.getScheduledNotifications();
```

### Hooks

#### `hooks/use-notifications.ts` - Hooks Personnalisés
Hooks React pour écouter les notifications.

**Hooks disponibles:**
```typescript
// Écouter quand l'utilisateur clique sur une notification
useNotificationListener((notification) => {
  console.log('Notification cliquée:', notification);
  // Naviguer, mises à jour, etc.
});

// Écouter les notifications reçues (app active ou non)
useNotificationListener2((notification) => {
  console.log('Notification reçue:', notification);
  // Traitement personnalisé
});
```

### Contexte Chèques

Le `ChecksProvider` intègre les notifications:

**Lors de l'ajout d'un chèque:**
```typescript
// 1. Crée le chèque
const newCheck = await checksStorage.addCheck(...);

// 2. Programme la notification 48h avant
const notificationId = await notificationService.scheduleCheckReminder(
  newCheck.id,
  newCheck.dueDate,
  newCheck.beneficiary
);

// 3. Sauvegarde l'ID de notification avec le chèque
await checksStorage.updateCheck(newCheck.id, { notificationId });
```

**Lors de la suppression:**
```typescript
// 1. Récupère l'ID de notification
const check = state.checks.find(c => c.id === checkId);

// 2. Annule la notification
if (check?.notificationId) {
  await notificationService.cancelNotification(check.notificationId);
}

// 3. Supprime le chèque
await checksStorage.deleteCheck(checkId);
```

**Lors du marquage comme encaissé:**
```typescript
// 1. Récupère l'ID de notification
const check = state.checks.find(c => c.id === checkId);

// 2. Annule la notification
if (check?.notificationId) {
  await notificationService.cancelNotification(check.notificationId);
}

// 3. Mets à jour le statut
await updateCheck(checkId, { status: 'cashed' });
```

## 📱 Interface Utilisateur

### Écran Principal
L'utilisateur voit les chèques triés par urgence:
- 🔴 **À encaisser** (aujourd'hui ou passé)
- 🟠 **À encaisser bientôt** (< 7 jours, reçoit notification 48h avant)
- 🟢 **En attente** (> 7 jours)
- ⚪ **Encaissés** (complétés)

### Notification Push
```
┌─────────────────────────────────┐
│ ⏰ Rappel - Chèque à finaliser  │
│                                 │
│ Le chèque de [Bénéficiaire]    │
│ expire dans 48 heures          │
│ (YYYY-MM-DD)                    │
└─────────────────────────────────┘
```

## 🔧 Configuration

### Déjà Configuré

- ✅ **Permissions:** Demandées automatiquement au démarrage
- ✅ **Handlers:** Configurés pour afficher les notifications
- ✅ **Intégration:** Liée au contexte des chèques
- ✅ **Délai:** 48 heures avant expiration

### Modifier le Délai

Pour changer le délai de 48 heures, éditez `utils/notifications.ts`:

```typescript
// Actuellement: 48 heures
const reminderDate = new Date(
  dueDateObj.getTime() - 48 * 60 * 60 * 1000 // ← Modifier ici
);

// Exemples:
// 24 heures: 24 * 60 * 60 * 1000
// 72 heures: 72 * 60 * 60 * 1000
// 7 jours: 7 * 24 * 60 * 60 * 1000
```

## 🧪 Test des Notifications

### Test Manuel

Créer un chèque avec une date d'expiration dans 48 heures:

```
1. Ouvrir l'app
2. Cliquer "Ajouter un chèque" (+)
3. Remplir les infos
4. Date de finalisation: 2 jours à partir d'aujourd'hui
5. Valider
6. La notification sera programmée
7. Attendre 48h ou modifier l'heure système pour tester
```

### Vérifier les Notifications Programmées

Ajouter ce code temporairement pour déboguer:

```typescript
import { notificationService } from '@/utils/notifications';

// Dans useEffect ou à l'initialisation
const checkScheduled = async () => {
  const scheduled = await notificationService.getScheduledNotifications();
  console.log('Notifications programmées:', scheduled);
};
```

## 🔐 Permissions

### Android
```xml
<!-- Dans AndroidManifest.xml (auto-généré par Expo) -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### iOS
```json
{
  "ios": {
    "infoPlist": {
      "NSLocalNetworkUsageDescription": "...",
      "NSBonjourServiceTypes": [...]
    }
  }
}
```

Les permissions sont **gérées automatiquement par Expo**.

## ⚠️ Limitations et Considérations

### React Native
- Les notifications push locales (sur l'appareil) fonctionnent hors ligne
- Pour les notifications depuis un serveur, nécessite un backend

### Délai de Précision
- Les notifications programmées locales ne sont pas 100% précises
- Peut être décalée de quelques secondes à quelques minutes

### État de l'App
- Si l'app est fermée: OS affiche la notification
- Si l'app est active: `handleNotification` détermine le comportement

### Données Sensibles
- Les données de notification sont stockées localement
- Ne pas stocker d'informations très sensibles (mot de passe, etc.)

## 🚀 Déploiement

### Sur App Store / Google Play
```
1. Les notifications locales fonctionnent par défaut
2. Inclure les permissions dans la description
3. Tester sur les appareils réels
4. Vérifier les paramètres de notification de l'utilisateur
```

### Configuration EAS

Dans `app.json`:
```json
{
  "plugins": [
    ["expo-notifications", {
      "icon": "./assets/icon.png",
      "sounds": ["./assets/notification.wav"]
    }]
  ]
}
```

## 📊 Exemples d'Utilisation

### Exemple 1: Afficher un Log à la Réception
```typescript
import { useNotificationListener } from '@/hooks/use-notifications';

export default function ChecksScreen() {
  useNotificationListener((notification) => {
    console.log('L\'utilisateur a cliqué:', notification.request.content.data);
  });

  return <View>{/* ... */}</View>;
}
```

### Exemple 2: Naviguer au Clic
```typescript
import { useRouter } from 'expo-router';
import { useNotificationListener } from '@/hooks/use-notifications';

export default function ChecksScreen() {
  const router = useRouter();

  useNotificationListener((notification) => {
    const { checkId } = notification.request.content.data;
    if (checkId) {
      router.push(`/edit-check?id=${checkId}`);
    }
  });

  return <View>{/* ... */}</View>;
}
```

### Exemple 3: Envoyer une Notification de Test
```typescript
import { notificationService } from '@/utils/notifications';

// Dans un écran de débogage
const sendTestNotification = async () => {
  await notificationService.sendTestNotification(
    '🧪 Test',
    'Ceci est une notification de test - elle apparaîtra dans 2 secondes'
  );
};
```

## 🔍 Dépannage

### Les notifications ne s'affichent pas

**Vérifier:**
1. Permissions accordées? (`Paramètres > [App] > Notifications`)
2. L'app est fermée au moment du rappel?
3. La date d'expiration est valide?
4. Le délai n'est pas dans le passé?

**Tester:**
```typescript
const hasPermission = await notificationService.requestPermissions();
console.log('Permission accordée?', hasPermission);

const scheduled = await notificationService.getScheduledNotifications();
console.log('Notifications programmées:', scheduled);
```

### Les notifications ont 48h de décalage

**Cause:** La date système du téléphone est incorrecte.
**Solution:** Vérifier et corriger la date/heure du téléphone.

### L'app crash au ajout de chèque

**Cause:** Erreur lors de la programmation de la notification.
**Solution:** Vérifier les logs et vérifier la date d'expiration.

## 📝 Notes de Développement

### Tests Automatisés
```typescript
// __tests__/notifications.test.ts
test('Programme une notification 48h avant', async () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const notificationId = await notificationService.scheduleCheckReminder(
    'test-123',
    dateStr,
    'Test Beneficiary'
  );

  expect(notificationId).not.toBeNull();
  
  const scheduled = await notificationService.getScheduledNotifications();
  expect(scheduled.length).toBeGreaterThan(0);
});
```

### Monitoring Production
```typescript
// Suivre les notifications échouées
const scheduleCheckReminder = async (...) => {
  try {
    const notificationId = await notificationService.scheduleCheckReminder(...);
    if (!notificationId) {
      console.warn('Échec programmation notification');
      // Envoyer à Sentry/logging service
    }
    return notificationId;
  } catch (error) {
    console.error('Erreur notification:', error);
    // Reporter à un service d'erreur
    throw error;
  }
};
```

## 🎯 Prochaines Améliorations

- [ ] Notifications push depuis un backend (Firebase Cloud Messaging)
- [ ] Sonneries personnalisées pour notifications
- [ ] Actions personnalisées dans les notifications (Marquer comme lu, etc.)
- [ ] Persistance des notifications reçues
- [ ] Historique des notifications
- [ ] Paramètres utilisateur pour les délais de rappel
- [ ] Notifications répétitives pour les chèques non encaissés

## 📚 Ressources

- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native Notifications](https://reactnative.dev/docs/native-modules-intro)
- [Push Notifications Best Practices](https://developer.android.com/develop/ui/views/notifications)
