import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type EnregistrerAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.Command.EnregistrerAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    attestationConformité: { format: string };
    enregistréeLe: DateTime.ValueType;
    enregistréePar: Email.ValueType;
  }
>;

export const registerEnregistrerAttestationConformitéCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerAttestationConformitéCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.enregistrerAttestationConformité(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.EnregistrerAttestationConformité', handler);
};
