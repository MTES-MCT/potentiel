import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet } from '@potentiel-domain/common';

export type EnregistrerDocumentProjetCommand = Message<
  'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
  {
    documentProjet: DocumentProjet.ValueType;
    content: ReadableStream;
  }
>;

export type EnregistrerDocumentPort = (
  document: DocumentProjet.ValueType,
  content: ReadableStream,
) => Promise<void>;

export type EnregistrerDocumentProjetDependencies = {
  enregistrerDocument: EnregistrerDocumentPort;
};

export const registerAccorderAbandonCommand = ({
  enregistrerDocument,
}: EnregistrerDocumentProjetDependencies) => {
  const handler: MessageHandler<EnregistrerDocumentProjetCommand> = ({ documentProjet, content }) =>
    enregistrerDocument(documentProjet, content);
  mediator.register('ENREGISTRER_DOCUMENT_PROJET_COMMAND', handler);
};
