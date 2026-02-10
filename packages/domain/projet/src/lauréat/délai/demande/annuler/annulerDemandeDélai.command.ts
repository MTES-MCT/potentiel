import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type AnnulerDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.AnnulerDemande',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerDemandeDélaiCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.délai.annulerDemandeDélai({
      dateAnnulation,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Délai.Command.AnnulerDemande', handler);
};
