# 💰 CHECKS - Application de Gestion de Chèques

Une application mobile React Native / Expo pour gérer vos chèques de manière simple, sécurisée et intuitive.

## 🎯 Fonctionnalités

### 👤 Gestion d'Authentification
- ✅ Inscription avec email et mot de passe
- ✅ Connexion sécurisée
- ✅ Stockage des données utilisateur local (AsyncStorage)
- ✅ Déconnexion simple

### 🧾 Gestion des Chèques
- ✅ **Ajouter un chèque** avec les champs:
  - Montant
  - Nom du bénéficiaire
  - Numéro du chèque (optionnel)
  - Date de dépôt
  - Date de finalisation/encaissement
  - Notes (optionnel)

- ✅ **Modifier un chèque** - Mise à jour complète des informations
- ✅ **Supprimer un chèque** - Avec confirmation de sécurité
- ✅ **Marquer comme encaissé** - Action rapide

### ⏰ Logique Métier Intelligente
- 📊 **Statuts automatiques** basés sur la date actuelle:
  - **En attente** (> 7 jours avant la date)
  - **À encaisser bientôt** (7 jours ou moins)
  - **À encaisser** (date passée ou aujourd'hui)
  - **Encaissé** (marqué manuellement)

- 🎯 **Mise à jour automatique** des statuts à chaque ouverture
- 🚨 **Alertes visuelles** pour les chèques à encaisser bientôt
- 📈 **Statistiques en temps réel** du portefeuille de chèques

### 📋 Listes et Filtres
- ✅ Vue **Tous les chèques**
- ✅ Filtre **À encaisser** (urgent)
- ✅ Filtre **À encaisser bientôt** (< 7 jours)
- ✅ Filtre **Encaissés** (historique)
- ✅ Tri automatique par date

### 👥 Profil Utilisateur
- Affichage des informations personnelles
- Avatar avec initiale du nom
- À propos de l'application
- Déconnexion sécurisée

## 🛠 Stack Technologique

- **Framework**: React Native avec Expo
- **Routeur**: Expo Router (avec tabs)
- **Stockage**: AsyncStorage (données persistantes)
- **État**: React Context API
- **Langage**: TypeScript
- **Design**: StyleSheet React Native

## 📦 Installation

```bash
# Cloner le projet
git clone <url-du-projet>
cd CHECKS

# Installer les dépendances
npm install

# Démarrer l'application
npm start

# Options de démarrage
npm run android     # Android
npm run ios         # iOS
npm run web         # Web
```

## 📱 Architecture de l'Application

### Structure des Fichiers
```
├── app/
│   ├── _layout.tsx              # Layout principal avec authentification
│   ├── login.tsx                # Écran de connexion/inscription
│   ├── add-check.tsx            # Modal d'ajout de chèque
│   └── (tabs)/
│       ├── _layout.tsx          # Navigation onglets
│       ├── checks.tsx           # Écran principal (liste des chèques)
│       └── profile.tsx          # Écran profil utilisateur
├── components/
│   └── check-card.tsx           # Composant affichant un chèque
├── context/
│   ├── auth-context.tsx         # Contexte d'authentification
│   └── checks-context.tsx       # Contexte de gestion des chèques
├── types/
│   └── index.ts                 # Types TypeScript
├── utils/
│   └── storage.ts               # Logique de persistance des données
└── constants/
    └── theme.ts                 # Thème et couleurs
```

### Flux de Données

```
┌─────────────────────────────────────────┐
│         Root Layout (_layout.tsx)       │
│  ┌─ AuthProvider                        │
│  │  └─ ChecksProvider                   │
│  │      ├─ Login Screen (si non auth)   │
│  │      └─ Tabs Navigation (si auth)    │
└─────────────────────────────────────────┘
         │              │
    ┌────▼─────┐  ┌────▼─────┐
    │  Checks  │  │  Profile  │
    │  Screen  │  │  Screen   │
    └──────────┘  └──────────┘
         │
    ┌────▼──────────────┐
    │  Check Card       │
    │  - Display        │
    │  - Actions        │
    │  - Status Visual  │
    └─────────────────┘
```

## 🔐 Sécurité

- ✅ Données utilisateur stockées localement
- ✅ Validation des entrées
- ✅ Chèques isolés par utilisateur
- ✅ Confirmation avant suppression
- ⚠️ **Note**: Pour une application en production, implémenter:
  - Backend d'authentification sécurisé
  - Hachage des mots de passe (bcrypt)
  - Chiffrement des données sensibles
  - API REST sécurisée

## 🎨 Interface Utilisateur

### Thème
- Mode clair et sombre supporté
- Couleurs intuitives:
  - 🟢 Vert: En attente (safe)
  - 🟠 Orange: À encaisser bientôt (warning)
  - 🔴 Rouge: À encaisser (danger)
  - ⚫ Gris: Encaissé (completed)

### Composants
- Cards avec ombres pour la profondeur
- Boutons d'action réactifs
- Modals pour les formulaires
- Refresh control pour actualiser
- TabBar de navigation intuitive

## 💡 Utilisation

### Ajouter un Chèque
1. Appuyer sur le bouton "+" en bas à droite
2. Remplir les champs obligatoires
3. Ajouter les informations optionnelles
4. Appuyer sur "Ajouter le chèque"

### Gérer un Chèque
- **Encaisser**: Bouton vert "✓ Encaisser"
- **Supprimer**: Bouton rouge "🗑 Supprimer"
- **Visualiser**: État et jours restants affichés automatiquement

### Filtrer les Chèques
1. Sélectionner l'onglet souhaité en haut:
   - Tous
   - À encaisser
   - À encaisser bientôt
   - Encaissés
2. La liste se met à jour automatiquement

## 🔄 Mise à Jour des Statuts

Les statuts des chèques sont automatiquement mis à jour:
- À chaque ouverture de l'application
- À chaque focus sur l'écran des chèques
- Lors du rafraîchissement manuel

## 🚀 Améliorations Futures

- [ ] Notifications pour les chèques à encaisser
- [ ] Export PDF des chèques
- [ ] Statistiques et graphiques
- [ ] Synchronisation cloud
- [ ] Sauvegarde automatique
- [ ] Mode hors ligne
- [ ] Reconnaissance d'image (OCR) pour les chèques
- [ ] Multi-langue

## 📄 Licence

Projet personnel - Tous droits réservés

## 👨‍💻 Développeur

Développé par un senior mobile developer
Version 1.0.0 - Janvier 2026

---

**Besoin d'aide?** Consultez la documentation ou créez une issue.
