import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type SupprimerDocumentProjetSensibleCommand = Message<
  'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
  }
>;

export type SupprimerDocumentProjetSensiblePort = (
  documentProjet: DocumentProjet.ValueType,
  raison: string,
) => Promise<void>;

export type SupprimerDocumentProjetSensibleCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
  supprimerDocumentProjetSensible: SupprimerDocumentProjetSensiblePort;
};

export const registerSupprimerDocumentProjetSensibleCommand = ({
  getProjetAggregateRoot,
  supprimerDocumentProjetSensible,
}: SupprimerDocumentProjetSensibleCommandDependencies) => {
  const handler: MessageHandler<SupprimerDocumentProjetSensibleCommand> = async ({
    identifiantProjet,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    const { pièceJustificative } = projet.lauréat.représentantLégal;

    if (pièceJustificative) {
      await supprimerDocumentProjetSensible(pièceJustificative, raison);
    }
  };

  mediator.register('Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible', handler);
};
