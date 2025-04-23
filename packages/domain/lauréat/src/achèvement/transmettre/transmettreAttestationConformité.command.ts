import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadAchèvementFactory } from '../achèvement.aggregate';
import { Abandon } from '../..';

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

export const registerTransmettreAttestationConformitéCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadAttestationConformitéAggregate = loadAchèvementFactory(loadAggregate);
  const loadAbandon = Abandon.loadAbandonFactory(loadAggregate);

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

    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();

    const abandon = await loadAbandon(identifiantProjet, false);

    await attestationConformité.transmettre({
      identifiantProjet,
      attestation,
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant,
      date,
      utilisateur,
      aUnAbandonAccordé: abandon.statut.estAccordé(),
    });
  };

  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
    handler,
  );
};
