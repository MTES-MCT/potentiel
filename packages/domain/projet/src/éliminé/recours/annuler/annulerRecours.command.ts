import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port.js';

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
