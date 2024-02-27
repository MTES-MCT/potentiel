import { Message, MessageHandler, mediator } from 'mediateur';

export type SupprimerDocumentProjetCommand = Message<
  'SUPPRIMER_DOCUMENT_PROJET_COMMAND',
  {
    documentKey: string;
  }
>;

export type SupprimerDocumentProjetPort = (documentKey: string) => Promise<void>;

export type SupprimerDocumentProjetDependencies = {
  supprimerDocumentProjet: SupprimerDocumentProjetPort;
};

export const registerSupprimerDocumentCommand = ({
  supprimerDocumentProjet,
}: SupprimerDocumentProjetDependencies) => {
  const handler: MessageHandler<SupprimerDocumentProjetCommand> = ({ documentKey }) =>
    supprimerDocumentProjet(documentKey);
  mediator.register('SUPPRIMER_DOCUMENT_PROJET_COMMAND', handler);
};
