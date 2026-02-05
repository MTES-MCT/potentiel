import { encodeParameter } from '../encodeParameter.js';

export const télécharger = (identifiantDocument: string) =>
  `/documents/${encodeParameter(identifiantDocument)}`;
