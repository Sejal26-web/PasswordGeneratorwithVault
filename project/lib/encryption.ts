import CryptoJS from 'crypto-js';

export function encryptData(data: string, userKey: string): string {
  return CryptoJS.AES.encrypt(data, userKey).toString();
}

export function decryptData(encryptedData: string, userKey: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, userKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}

export function generateEncryptionKey(email: string, masterPassword: string): string {
  return CryptoJS.PBKDF2(masterPassword, email, {
    keySize: 256 / 32,
    iterations: 100000,
  }).toString();
}
