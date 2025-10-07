export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  let password = '';

  if (options.includeUppercase) {
    charset += UPPERCASE;
  }
  if (options.includeLowercase) {
    charset += LOWERCASE;
  }
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  if (options.includeSymbols) {
    charset += SYMBOLS;
  }

  if (options.excludeSimilar) {
    charset = charset
      .split('')
      .filter((char) => !SIMILAR_CHARS.includes(char))
      .join('');
  }

  if (charset.length === 0) {
    charset = LOWERCASE + NUMBERS;
  }

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { score: 1, label: 'Weak', color: 'text-red-500' };
  } else if (score <= 4) {
    return { score: 2, label: 'Fair', color: 'text-orange-500' };
  } else if (score <= 5) {
    return { score: 3, label: 'Good', color: 'text-yellow-500' };
  } else {
    return { score: 4, label: 'Strong', color: 'text-green-500' };
  }
}
