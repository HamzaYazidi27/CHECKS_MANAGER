# 🚀 Guide de Déploiement - CHECKS

## 📋 Table des matières

1. [Avant de commencer](#avant-de-commencer)
2. [Déploiement Android](#déploiement-android)
3. [Déploiement iOS](#déploiement-ios)
4. [Déploiement Web](#déploiement-web)
5. [Production et Sécurité](#production-et-sécurité)

## Avant de commencer

### Prérequis
- Node.js 16+ installé
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Un compte Expo: https://expo.io

### Vérifier l'installation
```bash
node --version
npm --version
expo --version
```

## 🤖 Déploiement Android

### Méthode 1: APK Local (Test)

```bash
# Générer un APK sans Expo EAS
expo start
# Appuyez sur 'a' pour générer l'APK
```

### Méthode 2: Google Play (Production)

#### 1️⃣ Créer un compte Google Play Developer
- Visitez: https://play.google.com/console
- Frais: $25 (une fois)
- Créer une application

#### 2️⃣ Générer une clé de signature
```bash
# Générer une clé privée
keytool -genkey -v -keystore ~/my-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

#### 3️⃣ Configurer app.json
```json
{
  "expo": {
    "android": {
      "package": "com.example.checks",
      "versionCode": 1,
      "keystore": "~/my-upload-key.jks",
      "keystorePassword": "YOUR_PASSWORD",
      "keyAlias": "my-key-alias",
      "keyPassword": "YOUR_PASSWORD"
    }
  }
}
```

#### 4️⃣ Construire avec Expo EAS
```bash
npm install -g eas-cli

# Se connecter à Expo
eas login

# Créer une build
eas build --platform android --type apk

# Ou pour une release complète
eas build --platform android --type app-bundle
```

#### 5️⃣ Uploader sur Google Play
1. Allez à Google Play Console
2. Uploads > Versions de production
3. Uploadez le fichier AAB généré
4. Remplissez les informations obligatoires
5. Soumettez pour examen (24-48h)

---

## 🍎 Déploiement iOS

### Prérequis additionnels
- Mac avec Xcode
- Compte développeur Apple ($99/an)
- Certificate et Provisioning Profile

### Méthode 1: TestFlight (Test)

```bash
# Créer une build avec Expo EAS
eas build --platform ios --type simulator

# Ou pour tester sur appareil réel
eas build --platform ios --type preview
```

### Méthode 2: App Store (Production)

#### 1️⃣ Créer un compte Apple Developer
- Visitez: https://developer.apple.com
- Frais: $99/an
- Créer une app ID

#### 2️⃣ Configurer app.json
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.example.checks",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    }
  }
}
```

#### 3️⃣ Construire avec Expo EAS
```bash
eas build --platform ios --type app-store
```

#### 4️⃣ Uploader sur App Store
1. Utilisez Transporter (Apple)
2. Uploadez le fichier .ipa généré
3. Remplissez les métadonnées:
   - Nom
   - Description
   - Mots-clés
   - Captures d'écran
4. Soumettez pour examen (5-7 jours)

---

## 🌐 Déploiement Web

### Déployer sur Vercel (Recommandé)

#### 1️⃣ Installer Vercel CLI
```bash
npm i -g vercel
```

#### 2️⃣ Créer une build web
```bash
expo export --platform web --output-dir dist
```

#### 3️⃣ Déployer
```bash
vercel --prod
```

### Déployer sur Netlify

#### 1️⃣ Créer une build
```bash
npm run web
```

#### 2️⃣ Connecter à Netlify
1. Déplacer `web-build/` vers votre repo
2. Connecter à Netlify (GitHub, GitLab, Bitbucket)
3. Configurer:
   - Build command: `npm run web`
   - Publish directory: `web-build/`

### Déployer sur GitHub Pages

```bash
# Construire
expo export --platform web --output-dir dist

# Créer gh-pages branch
git checkout -b gh-pages

# Copier les fichiers
cp -r dist/* .

git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

Configurer dans les settings du repo:
- Pages > Branch: `gh-pages`

---

## 🔒 Production et Sécurité

### Avant le Déploiement

#### ✅ Sécurité
- [ ] Backend d'authentification sécurisé
- [ ] Hachage des mots de passe (bcrypt)
- [ ] HTTPS/SSL obligatoire
- [ ] Validation côté serveur
- [ ] Chiffrement des données sensibles
- [ ] Authentification 2FA

#### ✅ Performance
- [ ] Tester sur connexion 3G
- [ ] Optimiser les images
- [ ] Minimiser les dépendances
- [ ] Bundle size < 5MB

#### ✅ Qualité
- [ ] Tous les tests passent
- [ ] Pas de warnings console
- [ ] Code linting réussi
- [ ] Documentation complète

### Configuration Production

#### 1️⃣ Variables d'environnement
```bash
# .env.production
REACT_APP_API_URL=https://api.checks.com
REACT_APP_API_KEY=your-api-key
REACT_APP_ENV=production
```

#### 2️⃣ Mise à jour app.json
```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_APP_START",
      "fallbackToCacheTimeout": 30000,
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    }
  }
}
```

#### 3️⃣ Monitoring
```bash
# Ajouter Sentry pour les erreurs
npm install sentry-expo

# Ajouter Analytics
npm install expo-analytics
```

### Versioning

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1.0.0"
    }
  }
}
```

**Système de versioning**: MAJOR.MINOR.PATCH
- MAJOR: Changements majeurs (1.0.0)
- MINOR: Nouvelles fonctionnalités (1.1.0)
- PATCH: Corrections de bugs (1.0.1)

---

## 📊 Monitoring en Production

### Erreurs et Crashes
```bash
npm install sentry-expo

# Dans app.tsx
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInExpoDevelopment: true,
});
```

### Analytics
```bash
npm install expo-analytics

// Tracker les événements
analytics.track('check_added', {
  amount: 100,
  date: new Date(),
});
```

---

## 🐛 Troubleshooting

### Build échoue
```bash
# Nettoyer le cache
expo start --clear

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### La version ne met pas à jour
```bash
# Incrémenter la version
npm version patch

# Ou manuellement
# Éditer version dans app.json
```

### Erreurs de signature
```bash
# Pour Android
keytool -list -v -keystore ~/my-upload-key.jks

# Pour iOS
security find-identity -v -p codesigning
```

---

## 📞 Support

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://eas.expo.dev
- **React Native**: https://reactnative.dev

---

**Status**: ✅ Prêt pour la production
**Version**: 1.0.0
**Date**: Janvier 2026
