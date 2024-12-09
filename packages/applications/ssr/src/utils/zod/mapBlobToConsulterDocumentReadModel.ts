import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';

export const mapBlobToConsulterDocumentReadModel = (document: Blob) => {
  if (document.size === 0) {
    return undefined;
  }

  return {
    content: document.stream(),
    format: document.type,
  } as ConsulterDocumentProjetReadModel;
};
