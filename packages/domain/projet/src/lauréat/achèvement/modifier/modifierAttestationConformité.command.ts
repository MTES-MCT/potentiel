import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ModifierAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.Command.ModifierAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    attestation: DocumentProjet.ValueType;
    modifiéePar: Email.ValueType;
    modifiéeLe: DateTime.ValueType;
  }
>;

export const registerModifierAttestationConformitéCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierAttestationConformitéCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.modifierAttestationConformité(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.ModifierAttestationConformité', handler);
};
