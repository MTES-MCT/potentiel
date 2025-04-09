import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadPuissanceFactory } from '../../puissance.aggregate';

export type AccorderChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.AccorderDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    rôleUtilisateur: Role.ValueType;
    réponseSignée?: DocumentProjet.ValueType;
    estUneDécisionDEtat: boolean;
  }
>;

export const registerAccorderChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<AccorderChangementPuissanceCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
    rôleUtilisateur,
    estUneDécisionDEtat,
  }) => {
    const puissance = await loadPuissance(identifiantProjet);

    await puissance.accorderDemandeChangement({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
      rôleUtilisateur,
      estUneDécisionDEtat,
    });
  };
  mediator.register('Lauréat.Puissance.Command.AccorderDemandeChangement', handler);
};
