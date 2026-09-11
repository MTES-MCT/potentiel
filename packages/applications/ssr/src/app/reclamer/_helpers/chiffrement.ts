import crypto from 'node:crypto';

/**
 * IV (Initialization Vector) is a random value that is used along with a secret key for data encryption.
 * It ensures that the same plaintext encrypted multiple times will result in different ciphertexts.
 * This is crucial for security as it prevents patterns that could be exploited by attackers.
 *
 * It can be exposed to the client
 */
export const generateIV = () => {
  return crypto.randomBytes(16).toString('hex');
};

const getSecret = () => {
  const secret = process.env.POTENTIEL_IDENTIFIER_SECRET;
  if (!secret) {
    throw new Error('POTENTIEL_IDENTIFIER_SECRET is not defined');
  }
  return crypto.createHash('sha256').update(secret, 'utf8').digest();
};

export const chiffrerIdentifiantProjet = (identifiantProjet: string, iv: string) => {
  const cipher = crypto.createCipheriv('aes-256-gcm', getSecret(), Buffer.from(iv, 'hex'));
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(identifiantProjet, 'utf8')),
    cipher.final(),
  ]);
  return Buffer.concat([encrypted, cipher.getAuthTag()]).toString('base64');
};

export const déchiffrerIdentifiantProjet = (identifiantProjetChiffré: string, iv: string) => {
  const data = Buffer.from(identifiantProjetChiffré, 'base64');
  const authTag = data.subarray(data.length - 16);
  const encrypted = data.subarray(0, data.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', getSecret(), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
};
