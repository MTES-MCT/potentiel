import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

export type CorrigerDocumentProjetCommand = Message<
  'Document.Command.CorrigerDocumentProjet',
  {
    documentProjetKey: string;
    content: ReadableStream;
  }
>;

export type EnregistrerDocumentProjetPort = (key: string, content: ReadableStream) => Promise<void>;
export type ArchiverDocumentProjetPort = (source: string, target: string) => Promise<void>;

export type CorrigerDocumentProjetDependencies = {
  enregistrerDocumentProjet: EnregistrerDocumentProjetPort;
  archiverDocumentProjet: ArchiverDocumentProjetPort;
};

export const registerCorrigerDocumentProjetCommand = ({
  enregistrerDocumentProjet,
  archiverDocumentProjet,
}: CorrigerDocumentProjetDependencies) => {
  const handler: MessageHandler<CorrigerDocumentProjetCommand> = async ({
    documentProjetKey,
    content,
  }) => {
    // nous gardons l'ancien fichier stocké pour l'historique avec un timestamp
    await archiverDocumentProjet(
      documentProjetKey,
      `${documentProjetKey}_snapshot-${DateTime.now().formatter()}`,
    );
    return enregistrerDocumentProjet(documentProjetKey, content);
  };
  mediator.register('Document.Command.CorrigerDocumentProjet', handler);
};
