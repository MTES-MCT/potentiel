import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';

export const mapToConsulterDocumentProjetReadModel = (
  blob: Blob,
): ConsulterDocumentProjetReadModel => {
  return {
    content: blob.stream(),
    format: blob.type,
  } as ConsulterDocumentProjetReadModel;
};
