import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ModifierAchèvementCommand = Message<
  'Lauréat.Achèvement.Command.ModifierAchèvement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    attestation?: DocumentProjet.ValueType;
    preuveTransmissionAuCocontractant?: DocumentProjet.ValueType;
    date: DateTime.ValueType;
  }
>;

export const registerModifierAchèvementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierAchèvementCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.modifierAchèvement(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.ModifierAchèvement', handler);
};
