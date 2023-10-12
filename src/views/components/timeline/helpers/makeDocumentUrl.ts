import ROUTES from '@potentiel/routes';

export const makeDocumentUrl = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename);
};
