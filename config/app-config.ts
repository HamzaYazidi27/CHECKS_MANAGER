// Configuration de l'application CHECKS

export const APP_CONFIG = {
  // Informations de l'application
  APP_NAME: 'CHECKS',
  VERSION: '1.0.0',
  DESCRIPTION: 'Gestion de chèques personnels',
  
  // Configuration des statuts
  CHECK_STATUS: {
    PENDING: 'pending',
    UPCOMING: 'upcoming',
    DUE: 'due',
    CASHED: 'cashed',
  },

  // Configuration des jours
  DAYS_UNTIL_UPCOMING: 7, // Considérer comme "à encaisser bientôt" si < 7 jours
  
  // Couleurs des statuts
  STATUS_COLORS: {
    pending: '#4CAF50',    // Vert
    upcoming: '#FF9800',   // Orange
    due: '#f44336',        // Rouge
    cashed: '#9E9E9E',     // Gris
  },

  // Messages
  MESSAGES: {
    ERROR_AUTH_FAILED: 'Erreur d\'authentification',
    ERROR_INVALID_EMAIL: 'Email invalide',
    ERROR_WEAK_PASSWORD: 'Mot de passe faible',
    ERROR_USER_EXISTS: 'Cet utilisateur existe déjà',
    ERROR_NOT_FOUND: 'Élément non trouvé',
    
    SUCCESS_LOGIN: 'Connexion réussie',
    SUCCESS_LOGOUT: 'Déconnexion réussie',
    SUCCESS_CHECK_ADDED: 'Chèque ajouté avec succès',
    SUCCESS_CHECK_UPDATED: 'Chèque mis à jour',
    SUCCESS_CHECK_DELETED: 'Chèque supprimé',
    SUCCESS_CHECK_CASHED: 'Chèque marqué comme encaissé',
  },

  // Format des dates
  DATE_FORMAT: 'YYYY-MM-DD',
  DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',

  // Stockage AsyncStorage
  STORAGE_KEYS: {
    USERS: 'checks_users',
    CHECKS: 'checks_data',
    AUTH: 'checks_auth',
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    AMOUNT_REGEX: /^\d+(\.\d{1,2})?$/,
  },
};

export default APP_CONFIG;
