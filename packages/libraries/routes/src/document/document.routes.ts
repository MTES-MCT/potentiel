export const télécharger = (identifiantDocument: string) =>
  `/documents/${encodeURIComponent(identifiantDocument)}`;
