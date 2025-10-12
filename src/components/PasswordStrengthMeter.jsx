import React from 'react';

const calculateStrength = (password) => {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Contains number
  if (/\d/.test(password)) strength += 1;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 1;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return strength;
};

const getStrengthLabel = (strength) => {
  switch (strength) {
    case 0:
      return { label: 'Very Weak', color: 'bg-red-500' };
    case 1:
      return { label: 'Weak', color: 'bg-orange-500' };
    case 2:
      return { label: 'Fair', color: 'bg-yellow-500' };
    case 3:
      return { label: 'Good', color: 'bg-blue-500' };
    case 4:
    case 5:
      return { label: 'Strong', color: 'bg-green-500' };
    default:
      return { label: 'Very Weak', color: 'bg-red-500' };
  }
};

export default function PasswordStrengthMeter({ password }) {
  const strength = calculateStrength(password);
  const { label, color } = getStrengthLabel(strength);
  
  return (
    <div className="mt-1">
      <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 ${
              index < strength ? color : 'bg-gray-300'
            } ${index > 0 ? 'ml-1' : ''}`}
          />
        ))}
      </div>
      <p className={`text-sm mt-1 ${color.replace('bg-', 'text-')}`}>
        {label}
      </p>
    </div>
  );
}
