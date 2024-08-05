import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import {
  AjouterTâchePlanifiéeCommand,
  ExécuterTâchePlanifiéeUseCase,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';
import { sleep } from '../../../../../helpers/sleep';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

Quand(
  `un admin importe le type des garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] || 'consignation';
      const dateÉchéance = exemple[`date d'échéance`] || undefined;
      const importéLe = exemple[`date d'import `] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeValue: typeGarantiesFinancières,
          importéLeValue: new Date(importéLe).toISOString(),
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `l'utilisateur avec le rôle {string} modifie les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, rôle: string, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] || 'consignation';
      const dateÉchéance = exemple[`date d'échéance`] || undefined;
      const format = exemple['format'] || 'application/pdf';
      const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
      const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
      const modifiéLe = exemple['date mise à jour'] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.ModifierGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeValue: typeGarantiesFinancières,
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
          attestationValue: { content: convertStringToReadableStream(contenuFichier), format },
          dateConstitutionValue: new Date(dateConstitution).toISOString(),
          modifiéLeValue: new Date(modifiéLe).toISOString(),
          modifiéParValue: 'admin@test.test',
          rôleValue: rôle,
        },
      });
      await sleep(300);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un porteur enregistre l'attestation des garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const format = exemple['format'] || 'application/pdf';
      const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
      const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
      const enregistréLe = exemple['date mise à jour'] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: { content: convertStringToReadableStream(contenuFichier), format },
          dateConstitutionValue: new Date(dateConstitution).toISOString(),
          enregistréLeValue: new Date(enregistréLe).toISOString(),
          enregistréParValue: 'porteur@test.test',
        },
      });
      await sleep(300);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un admin enregistre les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] || 'consignation';
      const dateÉchéance = exemple[`date d'échéance`] || undefined;
      const format = exemple['format'] || 'application/pdf';
      const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
      const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
      const enregistréLe = exemple['date mise à jour'] || '2024-01-01';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeValue: typeGarantiesFinancières,
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
          attestationValue: { content: convertStringToReadableStream(contenuFichier), format },
          dateConstitutionValue: new Date(dateConstitution).toISOString(),
          enregistréLeValue: new Date(enregistréLe).toISOString(),
          enregistréParValue: 'admin@test.test',
        },
      });
      await sleep(300);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un admin échoie les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const échuLeValue = new Date(exemple['à échoir le']).toISOString();

      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet,
          tâches: [
            {
              typeTâchePlanifiée:
                GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
              àExécuterLe: DateTime.convertirEnValueType(échuLeValue),
            },
          ],
        },
      });
      await sleep(100);

      await mediator.send<ExécuterTâchePlanifiéeUseCase>({
        type: 'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeTâchePlanifiéeValue:
            GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
        },
      });
      await sleep(100);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
