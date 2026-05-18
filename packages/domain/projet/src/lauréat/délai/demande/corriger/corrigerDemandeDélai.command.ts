import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type CorrigerDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.CorrigerDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateCorrection: DateTime.ValueType;
    nombreDeMois: number;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }
>;

export const registerCorrigerDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<CorrigerDemandeDélaiCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateCorrection,
    nombreDeMois,
    raison,
    pièceJustificative,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.délai.corrigerDemandeDélai({
      identifiantUtilisateur,
      dateCorrection,
      nombreDeMois,
      raison,
      pièceJustificative,
    });
  };
  mediator.register('Lauréat.Délai.Command.CorrigerDemandeDélai', handler);
};
