import { GénérerModèleDocumentPort } from '@potentiel-domain/modele-document';
import { buildDocxDocument } from '@potentiel-infrastructure/document-builder';

export const générerModèleDocument: GénérerModèleDocumentPort = buildDocxDocument;
