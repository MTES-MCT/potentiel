import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';

export const mapToConsulterDocumentProjetReadModel = (
  blob: Blob,
): ConsulterDocumentProjetReadModel | undefined => {
  if (blob.size === 0) {
    return undefined;
  }

  return {
    content: blob.stream(),
    format: blob.type,
  } as ConsulterDocumentProjetReadModel;
};
