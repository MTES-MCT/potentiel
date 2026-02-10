import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '../index.js';

export type EnregistrerDocumentProjetCommand = Message<
  'Document.Command.EnregistrerDocumentProjet',
  {
    documentProjet: DocumentProjet.ValueType;
    content: ReadableStream;
  }
>;
/**
 * @todo Ici la key ne devrait pas être un string mais un IdentifiantDocumentProjet avec la propriété identifiantProjet, typeDocument et dateCréation
 */
export type EnregistrerDocumentProjetPort = (key: string, content: ReadableStream) => Promise<void>;

export type EnregistrerDocumentProjetDependencies = {
  enregistrerDocumentProjet: EnregistrerDocumentProjetPort;
};

export const registerEnregistrerDocumentProjetCommand = ({
  enregistrerDocumentProjet,
}: EnregistrerDocumentProjetDependencies) => {
  const handler: MessageHandler<EnregistrerDocumentProjetCommand> = ({ documentProjet, content }) =>
    enregistrerDocumentProjet(documentProjet.formatter(), content);
  mediator.register('Document.Command.EnregistrerDocumentProjet', handler);
};
