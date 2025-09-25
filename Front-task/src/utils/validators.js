// Validateurs pour les formulaires

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.trim().length >= minLength;
};

export const validateTaskTitle = (title) => {
  return validateRequired(title) && validateMinLength(title, 3);
};

export const validateTaskDescription = (description) => {
  return !description || validateMinLength(description, 10);
};

// Fonction de validation pour les formulaires
export const validateForm = (rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = rules[field].value;
    const validators = rules[field].validators || [];

    for (const validator of validators) {
      if (!validator(value)) {
        errors[field] = rules[field].errorMessage || `${field} is invalid`;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Constantes
export const VALIDATION_MESSAGES = {
  required: 'Ce champ est obligatoire',
  email: 'Veuillez entrer un email valide',
  password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  minLength: (length) => `Ce champ doit contenir au moins ${length} caractères`,
  taskTitle: 'Le titre doit contenir au moins 3 caractères',
  taskDescription: 'La description doit contenir au moins 10 caractères si elle est renseignée',
};
