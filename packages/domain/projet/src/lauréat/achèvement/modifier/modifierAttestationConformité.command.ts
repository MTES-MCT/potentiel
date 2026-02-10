import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ModifierAttestationConformitéCommand = Message<
  'Lauréat.AchèvementCommand.ModifierAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    attestation?: DocumentProjet.ValueType;
    preuveTransmissionAuCocontractant?: DocumentProjet.ValueType;
    date: DateTime.ValueType;
  }
>;

export const registerModifierAttestationConformitéCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierAttestationConformitéCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.modifierAttestationConformité(payload);
  };
  mediator.register('Lauréat.AchèvementCommand.ModifierAttestationConformité', handler);
};
