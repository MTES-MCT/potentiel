import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadAbandonFactory } from '../abandon.aggregate';
import { loadAchèvementFactory } from '../../achèvement/achèvement.aggregate';

export type AnnulerRejetAbandonCommand = Message<
  'Lauréat.Abandon.Command.AnnulerRejetAbandon',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerRejetAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);

  const handler: MessageHandler<AnnulerRejetAbandonCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);
    const achèvement = await loadAchèvement(identifiantProjet, false);

    await abandon.annulerRejet({
      dateAnnulation,
      identifiantProjet,
      identifiantUtilisateur,
      estAchevé: achèvement.estAchevé(),
    });
  };
  mediator.register('Lauréat.Abandon.Command.AnnulerRejetAbandon', handler);
};
