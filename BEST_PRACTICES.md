# 🎯 Meilleures Pratiques - CHECKS

## 📋 Guide de Style et Convention

### Nommage des Fichiers

```
✅ Correct                    ❌ Incorrect
─────────────────────────────────────────
check-card.tsx              CheckCard.tsx
auth-context.tsx            AuthContext.tsx
storage.ts                  Storage.ts
app-config.ts              appConfig.ts
use-color-scheme.ts        useColorScheme.ts
```

**Règles:**
- Components: kebab-case.tsx
- Hooks: kebab-case.ts (commencer par `use-`)
- Utilitaires: kebab-case.ts
- Context: kebab-case.tsx (commencer par le domaine)
- Types: kebab-case.ts

### Nommage des Variables

```typescript
// ✅ Correct
const isLoggedIn = true
const userEmail = 'user@example.com'
const checksList: Check[] = []
const onCheckAdded = () => {}

// ❌ Incorrect
const loggedIn = true          // Ambigüe
const email_user = 'user@...'  // Mauvaise convention
const checks = []              // Pas assez spécifique
const handleCheckAdded = ...   // Inconsistant
```

### Nommage des Fonctions

```typescript
// ✅ Correct - Actions
const handleLogin = async () => {}
const onRefresh = () => {}
const markAsCashed = (id: string) => {}

// ✅ Correct - Getters
const getCheckStatus = (date: string) => {}
const getUserChecks = (userId: string) => {}
const formatCurrency = (amount: number) => {}

// ✅ Correct - Boolean
const isLoading = true
const hasChecks = checks.length > 0
const shouldRefresh = true
```

---

## 🏗️ Architecture des Composants

### Structure d'un Composant Fonctionnel

```typescript
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Types
interface MyComponentProps {
  title: string
  onPress?: () => void
}

// Composant
const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Hooks
  const navigation = useNavigation();
  const [state, setState] = useState(false);

  // Callbacks mémorisés
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyComponent;
```

**Ordre des éléments:**
1. Imports
2. Types/Interfaces
3. Déclaration du composant
4. Logique (état, effects, callbacks)
5. JSX de retour
6. StyleSheet
7. Export

---

## 🔄 Gestion de l'État

### Utiliser Context pour l'État Global

```typescript
// ✅ BON - État global d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
```

### Utiliser useState pour l'État Local

```typescript
// ✅ BON - État local du formulaire
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState<ValidationErrors>({});
```

### Utiliser useCallback pour les Fonctions

```typescript
// ✅ BON - Mémoriser les fonctions
const handleSubmit = useCallback(async () => {
  if (!validate()) return;
  try {
    await login(email, password);
  } catch (error) {
    setError(error.message);
  }
}, [email, password, validate, login]);
```

---

## ✅ Validation des Données

### Validation au niveau du Formulaire

```typescript
interface ValidationErrors {
  email?: string
  password?: string
  name?: string
}

const validate = (): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Email
  if (!email) {
    errors.email = 'Email obligatoire';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email invalide';
  }

  // Mot de passe
  if (!password) {
    errors.password = 'Mot de passe obligatoire';
  } else if (password.length < 6) {
    errors.password = 'Minimum 6 caractères';
  }

  return errors;
};

const handleSubmit = async () => {
  const errors = validate();
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  try {
    await register(email, password, name);
  } catch (error) {
    Alert.alert('Erreur', error.message);
  }
};
```

### Validation des Données Métier

```typescript
// ✅ BON - Valider avant d'ajouter un chèque
const isValidCheck = (checkData: CheckData): boolean => {
  return (
    checkData.amount > 0 &&
    checkData.beneficiary.trim().length > 0 &&
    isValidDate(checkData.depositDate) &&
    isValidDate(checkData.dueDate) &&
    new Date(checkData.depositDate) <= new Date(checkData.dueDate)
  );
};

const handleAddCheck = async () => {
  if (!isValidCheck(checkData)) {
    Alert.alert('Erreur', 'Données invalides');
    return;
  }

  try {
    await addCheck(checkData);
  } catch (error) {
    Alert.alert('Erreur', error.message);
  }
};
```

---

## 🎨 Gestion des Styles

### Styles Cohérents

```typescript
// ✅ BON - Constantes de couleurs
const COLORS = {
  primary: '#007AFF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#f44336',
  gray: '#999999',
  background: '#f5f5f5',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
});
```

### Responsive Design

```typescript
// ✅ BON - Styles adaptatifs
import { useWindowDimensions } from 'react-native';

const MyComponent = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 600;

  const styles = StyleSheet.create({
    container: {
      padding: isSmallScreen ? SPACING.md : SPACING.lg,
      width: isSmallScreen ? '100%' : '80%',
    },
  });

  return <View style={styles.container} />;
};
```

---

## 🔐 Gestion des Erreurs

### Gestion des Erreurs Globales

```typescript
// ✅ BON - Try-catch avec messages utiles
try {
  const result = await risky Operation();
  setState({ data: result, error: null });
} catch (error: any) {
  const message = error.message || 'Une erreur est survenue';
  setState({ error: message });
  
  // Log pour débogage
  console.error('Erreur:', error);
}
```

### Messages d'Erreur Utilisateur

```typescript
// ✅ BON - Messages clairs et courts
const ERROR_MESSAGES = {
  NETWORK: 'Erreur réseau. Vérifiez votre connexion.',
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
  USER_EXISTS: 'Cet email est déjà utilisé.',
  FIELD_REQUIRED: 'Ce champ est obligatoire.',
};

// ❌ MAUVAIS
console.error(error);  // Détails techniques
```

---

## 📱 Optimisation des Performances

### Éviter les Re-renders Inutiles

```typescript
// ✅ BON - Utiliser useCallback
const handlePress = useCallback(() => {
  console.log('Pressed!');
}, []);

// ✅ BON - Passer des références stables
<CheckCard 
  check={check} 
  onPress={handlePress}  // Pas de fonction inline
/>

// ❌ MAUVAIS - Fonction créée à chaque render
<CheckCard 
  check={check} 
  onPress={() => console.log('Pressed!')}
/>
```

### Virtualisation des Listes

```typescript
// ✅ BON - FlatList pour longues listes
<FlatList
  data={checks}
  renderItem={({ item }) => <CheckCard check={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>

// ❌ MAUVAIS - ScrollView pour beaucoup d'items
<ScrollView>
  {checks.map(check => <CheckCard key={check.id} check={check} />)}
</ScrollView>
```

---

## 📝 Documentation du Code

### Commentaires Utiles

```typescript
// ✅ BON - Expliquer le "pourquoi"
// On utilise useCallback pour éviter les re-renders du CheckCard
// car il se mémorise avec useCallback
const handlePress = useCallback(() => {
  navigation.navigate('EditCheck', { check });
}, [navigation, check]);

// ✅ BON - Documenter les cas complexes
/**
 * Détermine le statut d'un chèque
 * @param dueDate - Date au format YYYY-MM-DD
 * @param currentStatus - Statut actuel du chèque
 * @returns Nouveau statut basé sur la date actuelle
 */
const getCheckStatus = (dueDate: string, currentStatus: CheckStatus) => {
  // Logique...
};

// ❌ MAUVAIS - Commentaires inutiles
// Augmenter count de 1
setCount(count + 1);

// ❌ MAUVAIS - Commentaires qui contredisent le code
const isValid = checkAmount < 0;  // Vérifier si positif
```

---

## 🧪 Tests et Débogage

### Fonction Testable

```typescript
// ✅ BON - Fonction pure, testable
export const getCheckStatus = (dueDate: string, currentStatus: CheckStatus): CheckStatus => {
  // Pas d'effet de bord, déterministe
  // Facile à tester
};

test('Should return CASHED if already cashed', () => {
  const status = getCheckStatus('2026-01-15', CheckStatus.CASHED);
  expect(status).toBe(CheckStatus.CASHED);
});

// ❌ MAUVAIS - Fonction impure, difficile à tester
export const getCheckStatus = (check: Check): CheckStatus => {
  // Accède à today() dynamiquement
  // Modifie l'état global
  // Effectue des appels API
};
```

### Logs de Débogage

```typescript
// ✅ BON - Logs structurés
console.log('[Storage] Chèques chargés:', checks.length);
console.log('[Context] État:', { isLoggedIn, user: user?.email });
console.log('[Component] Re-render cause:', 'checksChanged');

// ✅ BON - Grouper les logs
console.group('Opération d\'ajout de chèque');
console.log('Données:', checkData);
console.log('Validation:', isValid);
console.log('Résultat:', result);
console.groupEnd();

// ❌ MAUVAIS - Logs non informatifs
console.log('ok');
console.log(state);
```

---

## 📦 Dépendances et Imports

### Organisation des Imports

```typescript
// ✅ BON - Imports organisés
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/context/auth-context';
import { Check } from '@/types';
import CheckCard from '@/components/check-card';

// ❌ MAUVAIS - Imports désorganisés
import Check from '@/components/check-card';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import CheckCard from '@/components/check-card';
import { Check } from '@/types';
```

### Éviter les Dépendances Circulaires

```
✅ BON:
utils/storage.ts
  ↓
context/auth-context.tsx
  ↓
components/login.tsx

❌ MAUVAIS:
utils/storage.ts ← → context/auth-context.tsx
     ↑                      ↓
     └─── components/login.tsx
```

---

## 🚀 Bonnes Pratiques Globales

### Checklist de Code Review

- [ ] Nommage cohérent et explicite
- [ ] Types TypeScript corrects et complets
- [ ] Pas de `any` sans justification
- [ ] Gestion d'erreurs appropriée
- [ ] Pas de code dupliqué
- [ ] Validation des données d'entrée
- [ ] Aucun console.log en production
- [ ] Pas de logique métier dans les composants
- [ ] Composants < 300 lignes
- [ ] Tests pour la logique complexe
- [ ] Documentation pour les APIs publiques
- [ ] Pas d'effets de bord inattendus

### Commit Message

```
✅ BON
feat: Add check filtering by status
fix: Prevent crash when date is invalid
docs: Update README with installation steps
style: Apply consistent spacing in components

❌ MAUVAIS
fixed bugs
updated stuff
Changed some files
wip
```

### Code Quality Tools

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npx tsc --noEmit

# Tests
npm test

# Coverage
npm test -- --coverage
```

---

**Dernière mise à jour**: Janvier 2026
**Version**: 1.0.0
