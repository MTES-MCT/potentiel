import { Message, MessageHandler, mediator } from 'mediateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import { EnregistrerDocumentSubstitutPort } from '../../../../document-projet/index.js';

export type SupprimerDocumentProjetSensibleCommand = Message<
  'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
  }
>;

export type SupprimerDocumentProjetSensibleCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
  enregistrerDocumentSubstitut: EnregistrerDocumentSubstitutPort;
};

export const registerSupprimerDocumentProjetSensibleCommand = ({
  getProjetAggregateRoot,
  enregistrerDocumentSubstitut,
}: SupprimerDocumentProjetSensibleCommandDependencies) => {
  const handler: MessageHandler<SupprimerDocumentProjetSensibleCommand> = async ({
    identifiantProjet,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    const { pièceJustificative } = projet.lauréat.représentantLégal;

    if (pièceJustificative) {
      await enregistrerDocumentSubstitut(pièceJustificative, raison);
    }
  };

  mediator.register('Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible', handler);
};
