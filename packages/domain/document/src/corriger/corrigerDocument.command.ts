import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '..';

export type CorrigerDocumentProjetCommand = Message<
  'Document.Command.CorrigerDocumentProjet',
  {
    documentProjet: DocumentProjet.ValueType;
    content: ReadableStream;
  }
>;
/**
 * @todo Ici la key ne devrait pas être un string mais un IdentifiantDocumentProjet avec la propriété identifiantProjet, typeDocument et dateCréation
 */
export type EnregistrerDocumentProjetPort = (key: string, content: ReadableStream) => Promise<void>;
export type ArchiverDocumentProjetPort = (key: string) => Promise<void>;

export type CorrigerDocumentProjetDependencies = {
  enregistrerDocumentProjet: EnregistrerDocumentProjetPort;
  archiverDocumentProjet: ArchiverDocumentProjetPort;
};

export const registerCorrigerDocumentProjetCommand = ({
  enregistrerDocumentProjet,
  archiverDocumentProjet,
}: CorrigerDocumentProjetDependencies) => {
  const handler: MessageHandler<CorrigerDocumentProjetCommand> = async ({
    documentProjet,
    content,
  }) => {
    const documentKey = documentProjet.formatter();

    await archiverDocumentProjet(documentKey);
    return enregistrerDocumentProjet(documentProjet.formatter(), content);
  };
  mediator.register('Document.Command.CorrigerDocumentProjet', handler);
};
