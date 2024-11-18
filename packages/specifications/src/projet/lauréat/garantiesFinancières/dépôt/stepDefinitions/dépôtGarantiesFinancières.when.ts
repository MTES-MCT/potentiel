import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../.././../potentiel.world';
import { convertStringToReadableStream } from '../../../.././../helpers/convertStringToReadable';

Quand(
  'un porteur soumet un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type GF'] || 'consignation';
      const dateÉchéance = exemple[`date d'échéance`] || undefined;
      const format = exemple['format'] || 'application/pdf';
      const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
      const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
      const dateSoumission = exemple['date de soumission'] || '2024-01-02';
      const soumisPar = exemple['soumis par'] || 'user@test.test';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeValue: typeGarantiesFinancières,
          dateConstitutionValue: new Date(dateConstitution).toISOString(),
          soumisLeValue: new Date(dateSoumission).toISOString(),
          soumisParValue: soumisPar,
          attestationValue: { content: convertStringToReadableStream(contenuFichier), format },
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur modifie un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type GF'] || 'consignation';
      const dateÉchéance = exemple[`date d'échéance`] || undefined;
      const format = exemple['format'] || 'application/pdf';
      const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
      const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
      const dateModification = exemple['date de modification'] || '2024-01-02';
      const modifiéPar = exemple['modifié par'] || 'user@test.test';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.ModifierDépôtGarantiesFinancièresEnCoursUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          typeValue: typeGarantiesFinancières,
          dateConstitutionValue: new Date(dateConstitution).toISOString(),
          modifiéLeValue: new Date(dateModification).toISOString(),
          modifiéParValue: modifiéPar,
          attestationValue: { content: convertStringToReadableStream(contenuFichier), format },
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur supprime un dépôt de garanties financières pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.SupprimerGarantiesFinancièresÀTraiterUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue: 'porteur@test.test',
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur supprime un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
      const dateÉchéance = exemple[`date d'échéance`] || undefined;

      await mediator.send<GarantiesFinancières.SupprimerGarantiesFinancièresÀTraiterUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue: 'porteur@test.test',
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `l'utilisateur dreal valide un dépôt de garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const dateValidation = exemple['date de validation'];
    const dateÉchéance = exemple[`date d'échéance`] || undefined;
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          validéLeValue: new Date(dateValidation).toISOString(),
          validéParValue: 'dreal@test.test',
          ...(dateÉchéance && { dateÉchéanceValue: new Date(dateÉchéance).toISOString() }),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
