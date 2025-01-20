import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '..';

export type SupprimerDocumentProjetSensibleCommand = Message<
  'Document.Command.SupprimerDocumentProjetSensible',
  {
    documentProjet: DocumentProjet.ValueType;
    raison: string;
  }
>;

export type SupprimerDocumentProjetSensiblePort = (
  documentProjet: DocumentProjet.ValueType,
  raison: string,
) => Promise<void>;

export type SupprimerDocumentProjetSensibleDependencies = {
  supprimerDocumentProjetSensible: SupprimerDocumentProjetSensiblePort;
};

export const registerSupprimerDocumentProjetSensible = ({
  supprimerDocumentProjetSensible,
}: SupprimerDocumentProjetSensibleDependencies) => {
  const handler: MessageHandler<SupprimerDocumentProjetSensibleCommand> = ({
    documentProjet,
    raison,
  }) => supprimerDocumentProjetSensible(documentProjet, raison);
  mediator.register('Document.Command.SupprimerDocumentProjetSensible', handler);
};
