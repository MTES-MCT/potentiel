import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type EnregistrerChangementNomProjetCommand = Message<
  'Lauréat.Command.EnregistrerChangementNomProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nomProjet: string;
    dateChangement: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison?: string;
  }
>;

export const registerEnregistrerChangementNomProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementNomProjetCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nomProjet,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.enregistrerChangementNomProjet({
      enregistréPar: identifiantUtilisateur,
      nomProjet,
      enregistréLe: dateChangement,
      pièceJustificative,
      raison,
    });
  };
  mediator.register('Lauréat.Command.EnregistrerChangementNomProjet', handler);
};
