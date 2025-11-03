import CryptoJS from 'crypto-js';

const AUTH_STORAGE_SECRET = process.env.AUTH_STORAGE_SECRET ?? '';

if (!AUTH_STORAGE_SECRET) {
  console.warn(
    'AUTH_STORAGE_SECRET no está definida. El almacenamiento cifrado no será seguro.'
  );
}

export const encrypt = (plain: string): string => {
  if (!AUTH_STORAGE_SECRET) {
    return plain;
  }

  return CryptoJS.AES.encrypt(plain, AUTH_STORAGE_SECRET).toString();
};

export const decrypt = (cipher: string): string => {
  if (!AUTH_STORAGE_SECRET) {
    return cipher;
  }

  const bytes = CryptoJS.AES.decrypt(cipher, AUTH_STORAGE_SECRET);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    throw new Error('No se pudo descifrar el contenido.');
  }

  return decrypted;
};

