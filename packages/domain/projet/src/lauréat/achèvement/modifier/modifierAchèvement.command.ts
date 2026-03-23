import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

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
