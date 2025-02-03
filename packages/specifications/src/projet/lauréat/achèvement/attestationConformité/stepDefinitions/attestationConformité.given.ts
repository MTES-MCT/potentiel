import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

EtantDonné(
  'une attestation de conformité transmise pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const attestationValue = {
      content: convertStringToReadableStream('contenu par défaut'),
      format: 'application/pdf',
    };

    const dateTransmissionAuCocontractantValue = new Date().toISOString();

    const preuveTransmissionAuCocontractantValue = {
      content: convertStringToReadableStream('contenu par défaut'),
      format: 'application/pdf',
    };

    const dateValue = new Date().toISOString();

    const utilisateurValue = 'utilisateur@test.test';

    await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        attestationValue,
        dateTransmissionAuCocontractantValue,
        dateValue,
        preuveTransmissionAuCocontractantValue,
        utilisateurValue,
      },
    });
  },
);
