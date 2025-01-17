import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '..';

export type SupprimerDocumentProjetSensibleCommand = Message<
  'Document.Command.SupprimerDocumentProjetSensible',
  {
    documentProjet: DocumentProjet.ValueType;
    raison: string;
  }
>;
/**
 * @todo Ici la key ne devrait pas être un string mais un IdentifiantDocumentProjet avec la propriété identifiantProjet, typeDocument et dateCréation
 */
export type SupprimerDocumentProjetSensiblePort = (key: string, raison: string) => Promise<void>;

export type SupprimerDocumentProjetSensibleDependencies = {
  supprimerDocumentProjetSensible: SupprimerDocumentProjetSensiblePort;
};

export const registerSupprimerDocumentProjetSensible = ({
  supprimerDocumentProjetSensible,
}: SupprimerDocumentProjetSensibleDependencies) => {
  const handler: MessageHandler<SupprimerDocumentProjetSensibleCommand> = ({
    documentProjet,
    raison,
  }) => supprimerDocumentProjetSensible(documentProjet.formatter(), raison);
  mediator.register('Document.Command.SupprimerDocumentProjetSensible', handler);
};
