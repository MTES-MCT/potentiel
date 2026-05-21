import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type TransmettreAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.Command.TransmettreAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    date: DateTime.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    rapportAssocié: DocumentProjet.ValueType;
    preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  }
>;

export const registerTransmettreAttestationConformitéCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreAttestationConformitéCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.transmettreAttestationConformité(payload);
  };
  mediator.register('Lauréat.Achèvement.Command.TransmettreAttestationConformité', handler);
};
