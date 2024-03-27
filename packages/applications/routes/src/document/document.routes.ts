import { encodeParameter } from '../encodeParameter';

export const télécharger = (identifiantDocument: string) =>
  `/documents/${encodeParameter(identifiantDocument)}`;
