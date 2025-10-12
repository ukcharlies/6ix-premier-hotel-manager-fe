const passwordStrengthRegex = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumbers: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < passwordStrengthRegex.minLength) {
    errors.push(`Password must be at least ${passwordStrengthRegex.minLength} characters long`);
  }
  if (!passwordStrengthRegex.hasUpperCase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!passwordStrengthRegex.hasLowerCase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!passwordStrengthRegex.hasNumbers.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!passwordStrengthRegex.hasSpecialChar.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    error: emailRegex.test(email) ? null : 'Please enter a valid email address'
  };
};
