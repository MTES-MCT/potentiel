import { Document } from '@potentiel-domain/projet';

export const mapToConsulterDocumentProjetReadModel = (
  blob: Blob,
): Document.ConsulterDocumentProjetReadModel => {
  return {
    content: blob.stream(),
    format: blob.type,
  } as Document.ConsulterDocumentProjetReadModel;
};
