import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../..';
import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

export type AnnulerRecoursCommand = Message<
  'Éliminé.Recours.Command.AnnulerRecours',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AnnulerRecoursCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.annuler({
      dateAnnulation,
      identifiantUtilisateur,
    });
  };
  mediator.register('Éliminé.Recours.Command.AnnulerRecours', handler);
};
