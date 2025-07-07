import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  'une attestation de conformité transmise pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateTransmissionAuCocontractant, date, utilisateur, attestation, preuve } =
      this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({});

    await mediator.send<Lauréat.Achèvement.AttestationConformité.TransmettreAttestationConformitéUseCase>(
      {
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation,
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: preuve,
          identifiantUtilisateurValue: utilisateur,
        },
      },
    );
  },
);
