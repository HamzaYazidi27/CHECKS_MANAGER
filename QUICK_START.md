# 🚀 Guide de Démarrage Rapide - CHECKS

## ⚡ 5 minutes pour commencer

### 1️⃣ Installation des dépendances
```bash
npm install
```

### 2️⃣ Lancer l'application
```bash
npm start
```

### 3️⃣ Choisir votre plateforme
- **Android**: Appuyez sur `a`
- **iOS**: Appuyez sur `i`
- **Web**: Appuyez sur `w`

## 📝 Première utilisation

### Créer un compte
1. **Email**: `test@example.com`
2. **Mot de passe**: `test123`
3. **Nom**: `Jean Dupont`
4. Appuyez sur "S'inscrire"

### Ajouter votre premier chèque
1. Appuyez sur le bouton **"+"** en bas à droite
2. Remplissez les champs:
   - **Montant**: `1500.00`
   - **Bénéficiaire**: `Entreprise ABC`
   - **Date de finalisation**: `2026-02-01` (future)
3. Appuyez sur **"Ajouter le chèque"**

### Naviguer l'application
- 📋 **Onglet Chèques**: Voir tous vos chèques
- 👤 **Onglet Profil**: Informations utilisateur

### Trier vos chèques
En haut de l'écran des chèques:
- **Tous**: Affiche tous les chèques
- **À encaisser**: Chèques urgents (date passée/aujourd'hui)
- **Bientôt**: Chèques dans les 7 prochains jours
- **Encaissés**: Historique des chèques traités

## 🎯 Fonctionnalités principales

### Ajouter un chèque ➕
| Champ | Obligatoire | Type |
|-------|-------------|------|
| Montant | ✅ | Décimal |
| Bénéficiaire | ✅ | Texte |
| N° du chèque | ❌ | Numérique |
| Date de dépôt | ✅ | Date (YYYY-MM-DD) |
| Date de finalisation | ✅ | Date (YYYY-MM-DD) |
| Notes | ❌ | Texte libre |

### Gérer un chèque 🔧
**Sur chaque chèque, vous pouvez:**
- ✅ **Encaisser** - Le marquer comme complété
- 🗑️ **Supprimer** - Le retirer (confirmation demandée)

### Comprendre les statuts 📊

| Statut | Couleur | Signification |
|--------|---------|---------------|
| En attente | 🟢 Vert | Plus de 7 jours avant la date |
| À encaisser bientôt | 🟠 Orange | 7 jours ou moins |
| À encaisser | 🔴 Rouge | Date passée ou aujourd'hui |
| Encaissé | ⚫ Gris | Marqué comme complété |

## 💾 Données et Stockage

- ✅ **Stockage local** sur votre appareil
- ✅ **Privé** - Les données ne quittent pas votre téléphone
- ✅ **Persistant** - Les données restent après fermeture de l'app
- ✅ **Sécurisé** - Un utilisateur ne voit que ses données

## ⚙️ Configuration

### Variables d'environnement
Aucune requise pour la version mobile locale.

### Base de données
- Type: AsyncStorage (mobile)
- Format: JSON
- Localisation: Stockage local de l'appareil

## 🐛 Dépannage

### L'app refuse ma connexion
**Solution**: Vérifiez que vous avez d'abord créé un compte avec ce même email/mot de passe

### Je ne vois pas mes chèques
**Solution**: 
1. Vérifiez que vous êtes connecté
2. Tirez vers le bas pour rafraîchir
3. Assurez-vous d'avoir ajouté des chèques

### Les statuts ne se mettent pas à jour
**Solution**: Sortez l'app et rouvrez-la pour forcer la mise à jour

### L'app plante au démarrage
**Solution**:
```bash
npm install
npm start -- --clear
```

## 📱 Compatibilité

| Plateforme | Support |
|-----------|---------|
| Android | ✅ 8.0+ |
| iOS | ✅ 12.0+ |
| Web | ✅ Tous navigateurs |

## 🔒 Sécurité - Important ⚠️

**Version Développement**: Les données sont stockées en local sans chiffrement

**Pour la Production**: Vous devriez:
- [ ] Ajouter un backend sécurisé
- [ ] Implémenter bcrypt pour les mots de passe
- [ ] Chiffrer les données sensibles
- [ ] Ajouter une authentification 2FA
- [ ] Implémenter HTTPS/SSL

## 📚 Structure du projet

```
CHECKS/
├── app/                    # Écrans de l'application
├── components/             # Composants réutilisables
├── context/               # État global (Auth, Checks)
├── types/                 # Types TypeScript
├── utils/                 # Utilitaires et stockage
└── constants/             # Thème et constantes
```

## 🎨 Personnalisation

### Changer les couleurs
Éditez `constants/theme.ts`:
```typescript
export const Colors = {
  light: {
    tint: '#007AFF',  // Couleur principale
    // ...
  },
};
```

### Changer les textes
Tous les textes sont directement dans les composants. Cherchez et remplacez les strings.

## 💡 Conseils d'utilisation

1. **Organisez-vous**: Regroupez les chèques par projet/client avec les notes
2. **Mettez à jour régulièrement**: Marquez comme encaissé dès réception
3. **Utilisez les filtres**: Restez concentré sur l'urgent
4. **Notez les détails**: Utilisez le champ notes pour les références

## 🆘 Besoin d'aide?

1. Vérifiez le fichier `README_APP.md` pour plus de détails
2. Consultez les types TypeScript dans `types/index.ts`
3. Vérifiez la logique dans `utils/storage.ts`

## 📞 Support

Pour les bugs ou suggestions, créez une issue dans le repo.

---

**Bon gestion de chèques! 💰**
