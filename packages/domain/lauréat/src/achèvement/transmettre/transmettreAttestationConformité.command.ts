import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Éliminé } from '@potentiel-domain/elimine';

import { loadAchèvementFactory } from '../achèvement.aggregate';

export type TransmettreAttestationConformitéCommand = Message<
  'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    attestation: DocumentProjet.ValueType;
    dateTransmissionAuCocontractant: DateTime.ValueType;
    preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
    date: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerTransmettreAttestationConformitéCommand = (loadAggregate: LoadAggregate) => {
  const loadAttestationConformitéAggregate = loadAchèvementFactory(loadAggregate);
  const loadÉliminé = Éliminé.loadÉliminéFactory(loadAggregate);

  const handler: MessageHandler<TransmettreAttestationConformitéCommand> = async ({
    identifiantProjet,
    attestation,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
    date,
    utilisateur,
  }) => {
    const attestationConformité = await loadAttestationConformitéAggregate(
      identifiantProjet,
      false,
    );
    const éliminé = await loadÉliminé(identifiantProjet, false);

    await attestationConformité.transmettre({
      identifiantProjet,
      attestation,
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant,
      date,
      utilisateur,
      estUnProjetÉliminé: éliminé.identifiantProjet.estÉgaleÀ(identifiantProjet),
    });
  };

  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
    handler,
  );
};
