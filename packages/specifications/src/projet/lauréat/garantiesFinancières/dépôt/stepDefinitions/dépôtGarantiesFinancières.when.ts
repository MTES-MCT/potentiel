import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../.././../potentiel.world';
import { sleep } from '../../../.././../helpers/sleep';

import { getDépôtData } from './helper';

Quand(
  'un porteur soumet un dépôt de garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        dateConstitutionValue,
        attestationValue,
        soumisLeValue,
        soumisParValue,
      } = getDépôtData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
        data: {
          identifiantProjetValue,
          typeValue,
          dateÉchéanceValue,
          dateConstitutionValue,
          attestationValue,
          soumisLeValue,
          soumisParValue,
        },
      });
      await sleep(500);
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
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        dateConstitutionValue,
        modifiéLeValue,
        modifiéParValue,
        attestationValue,
      } = getDépôtData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.ModifierDépôtGarantiesFinancièresEnCoursUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
        data: {
          identifiantProjetValue,
          typeValue,
          dateÉchéanceValue,
          dateConstitutionValue,
          modifiéLeValue,
          modifiéParValue,
          attestationValue,
        },
      });
      await sleep(500);
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
      const { suppriméLeValue, suppriméParValue } = getDépôtData(identifiantProjet, {});
      await mediator.send<GarantiesFinancières.SupprimerGarantiesFinancièresÀTraiterUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          suppriméLeValue,
          suppriméParValue,
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `l'utilisateur dreal valide un dépôt de garanties financières pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const { validéLeValue, validéParValue } = getDépôtData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          validéLeValue,
          validéParValue,
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
