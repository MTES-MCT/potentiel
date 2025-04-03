import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadPuissanceFactory } from '../../puissance.aggregate';

export type SupprimerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.SupprimerChangementPuissance',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateSuppression: DateTime.ValueType;
  }
>;

export const registerSupprimerChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const load = loadPuissanceFactory(loadAggregate);
  const handler: MessageHandler<SupprimerChangementPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateSuppression,
  }) => {
    const puissance = await load(identifiantProjet, false);

    await puissance.supprimerDemandeChangement({
      identifiantProjet,
      identifiantUtilisateur,
      dateSuppression,
    });
  };
  mediator.register('Lauréat.Puissance.Command.SupprimerChangementPuissance', handler);
};
