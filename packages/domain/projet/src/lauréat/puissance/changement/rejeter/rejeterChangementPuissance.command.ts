import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type RejeterChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.RejeterDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
    estUneDécisionDEtat: boolean;
  }
>;

export const registerRejeterChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterChangementPuissanceCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
    rôleUtilisateur,
    estUneDécisionDEtat,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.rejeterDemandeChangement({
      rejetéLe,
      rejetéPar,
      réponseSignée,
      rôleUtilisateur,
      estUneDécisionDEtat,
    });
  };
  mediator.register('Lauréat.Puissance.Command.RejeterDemandeChangement', handler);
};
