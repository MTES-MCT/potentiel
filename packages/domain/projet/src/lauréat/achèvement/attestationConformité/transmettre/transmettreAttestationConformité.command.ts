import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type TransmettreAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    attestation: DocumentProjet.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
    date: DateTime.ValueType;
  }
>;

export const registerTransmettreAttestationConformitéCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreAttestationConformitéCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.achèvement.transmettreAttestationConformité(payload);
  };
  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
    handler,
  );
};
