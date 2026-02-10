import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../index.js';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type EnregistrerChangementNomProjetCommand = Message<
  'Lauréat.Command.EnregistrerChangementNomProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    enregistréPar: Email.ValueType;
    nomProjet: string;
    enregistréLe: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerEnregistrerChangementNomProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementNomProjetCommand> = async ({
    identifiantProjet,
    enregistréPar,
    nomProjet,
    enregistréLe,
    pièceJustificative,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.enregistrerChangementNomProjet({
      enregistréPar,
      nomProjet,
      enregistréLe,
      pièceJustificative,
      raison,
    });
  };
  mediator.register('Lauréat.Command.EnregistrerChangementNomProjet', handler);
};
