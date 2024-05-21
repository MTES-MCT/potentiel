import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { loadAchèvementFactory } from '../achèvement.aggregate';

export type ModifierAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    attestation: DocumentProjet.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
    date: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerModifierAttestationConformitéCommand = (loadAggregate: LoadAggregate) => {
  const loadAchèvementAggregate = loadAchèvementFactory(loadAggregate);
  const handler: MessageHandler<ModifierAttestationConformitéCommand> = async ({
    identifiantProjet,
    attestation,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
    date,
    utilisateur,
  }) => {
    const attestationConformité = await loadAchèvementAggregate(identifiantProjet, false);

    await attestationConformité.modifier({
      identifiantProjet,
      attestation,
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant,
      date,
      utilisateur,
    });
  };
  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
    handler,
  );
};
