import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';
import { sleep } from '../../../../../helpers/sleep';
import { Achèvement } from '@potentiel-domain/laureat';

Quand(
  'le projet {string} avec une attestation de conformité transmise',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

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

    await mediator.send<Achèvement.AttestationConformité.TransmettreAttestationConformitéUseCase>({
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
    await sleep(100);
  },
);
