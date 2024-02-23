import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadRecoursFactory } from '../recours.aggregate';

export type AnnulerRecoursCommand = Message<
  'ANNULER_RECOURS_COMMAND',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerRecoursCommand = (loadAggregate: LoadAggregate) => {
  const loadRecours = loadRecoursFactory(loadAggregate);
  const handler: MessageHandler<AnnulerRecoursCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const recours = await loadRecours(identifiantProjet);

    await recours.annuler({
      dateAnnulation,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('ANNULER_RECOURS_COMMAND', handler);
};
