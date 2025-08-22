import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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
