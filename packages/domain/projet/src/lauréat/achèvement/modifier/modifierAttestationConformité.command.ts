import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    attestation: DocumentProjet.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
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
  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
    handler,
  );
};
