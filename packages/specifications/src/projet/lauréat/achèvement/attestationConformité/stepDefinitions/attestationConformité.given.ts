import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  'une attestation de conformité transmise pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const {
      attestation: { content, format },
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
    } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({});

    await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        attestationValue: { format, content },
        dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
        dateValue: date,
        preuveTransmissionAuCocontractantValue: { format, content },
        utilisateurValue: utilisateur,
      },
    });
  },
);
