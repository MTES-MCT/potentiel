import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadPuissanceFactory } from '../../puissance.aggregate';

export type AnnulerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.AnnulerDemandeChangement',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<AnnulerChangementPuissanceCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const puissance = await loadPuissance(identifiantProjet);

    await puissance.annulerDemandeChangement({
      dateAnnulation,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Puissance.Command.AnnulerDemandeChangement', handler);
};
