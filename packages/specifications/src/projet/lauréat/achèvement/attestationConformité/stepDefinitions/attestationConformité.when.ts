import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

Quand(
  'un porteur transmet une attestation de conformité pour le projet {lauréat-éliminé} {string} avec :',
  async function (
    this: PotentielWorld,
    statutProjet: 'lauréat' | 'éliminé',
    nomProjet: string,
    dataTable: DataTable,
  ) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } =
        statutProjet === 'lauréat'
          ? this.lauréatWorld.rechercherLauréatFixture(nomProjet)
          : this.eliminéWorld.rechercherÉliminéFixture(nomProjet);

      const attestationValue = {
        content: exemple['contenu attestation']
          ? convertStringToReadableStream(exemple['contenu attestation'])
          : convertStringToReadableStream('contenu par défaut'),
        format: exemple['format attestation'] || 'application/pdf',
      };

      const dateTransmissionAuCocontractantValue = exemple['date transmission au co-contractant']
        ? new Date(exemple['date transmission au co-contractant']).toISOString()
        : new Date().toISOString();

      const preuveTransmissionAuCocontractantValue = {
        content: exemple['contenu preuve transmission au co-contractant']
          ? convertStringToReadableStream(exemple['contenu preuve transmission au co-contractant'])
          : convertStringToReadableStream('contenu par défaut'),
        format: exemple['format preuve transmission au co-contractant'] || 'application/pdf',
      };

      const dateValue = exemple['date']
        ? new Date(exemple['date']).toISOString()
        : new Date().toISOString();

      const utilisateurValue = exemple['utilisateur'] || 'utilisateur@test.test';

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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "un admin modifie l'attestation de conformité pour le projet {string} avec :",
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const attestationValue = {
        content: exemple['contenu attestation']
          ? convertStringToReadableStream(exemple['contenu attestation'])
          : convertStringToReadableStream('contenu par défaut'),
        format: exemple['format attestation'] || 'application/pdf',
      };

      const dateTransmissionAuCocontractantValue = exemple['date transmission au co-contractant']
        ? new Date(exemple['date transmission au co-contractant']).toISOString()
        : new Date().toISOString();

      const preuveTransmissionAuCocontractantValue = {
        content: exemple['contenu preuve transmission au co-contractant']
          ? convertStringToReadableStream(exemple['contenu preuve transmission au co-contractant'])
          : convertStringToReadableStream('contenu par défaut'),
        format: exemple['format preuve transmission au co-contractant'] || 'application/pdf',
      };

      const dateValue = exemple['date']
        ? new Date(exemple['date']).toISOString()
        : new Date().toISOString();

      const utilisateurValue = exemple['utilisateur'] || 'utilisateur@test.test';

      await mediator.send<Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue,
          dateTransmissionAuCocontractantValue,
          dateValue,
          preuveTransmissionAuCocontractantValue,
          utilisateurValue,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
