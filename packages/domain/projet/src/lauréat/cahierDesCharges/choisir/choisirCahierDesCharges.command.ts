import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ChoisirCahierDesChargesCommand = Message<
  'Lauréat.Command.ChoisirCahierDesCharges',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType;
  }
>;

export const registerChoisirCahierDesChargesCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ChoisirCahierDesChargesCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.choisirCahierDesCharges(payload);
  };
  mediator.register('Lauréat.Command.ChoisirCahierDesCharges', handler);
};
