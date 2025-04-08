import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { loadPuissanceFactory } from '../../puissance.aggregate';

export type RejeterChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.RejeterChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerRejeterChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<RejeterChangementPuissanceCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
    rôleUtilisateur,
  }) => {
    const puissance = await loadPuissance(identifiantProjet);

    await puissance.rejeterDemandeChangement({
      identifiantProjet,
      rejetéLe,
      rejetéPar,
      réponseSignée,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.Puissance.Command.RejeterChangement', handler);
};
