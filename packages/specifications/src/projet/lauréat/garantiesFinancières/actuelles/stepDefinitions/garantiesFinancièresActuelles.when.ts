import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';
import { sleep } from '../../../../../helpers/sleep';
import { getGarantiesFinancièresActuellesData } from '../../helpers';

Quand(
  `un admin importe le type des garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const { identifiantProjetValue, typeValue, dateÉchéanceValue, importéLeValue } =
        getGarantiesFinancièresActuellesData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
        data: {
          identifiantProjetValue,
          typeValue,
          dateÉchéanceValue,
          importéLeValue,
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un admin modifie les garanties financières actuelles pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        attestationValue,
        dateConstitutionValue,
        modifiéLeValue,
        modifiéParValue,
      } = getGarantiesFinancièresActuellesData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.ModifierGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
        data: {
          identifiantProjetValue,
          typeValue,
          dateÉchéanceValue,
          attestationValue,
          dateConstitutionValue,
          modifiéLeValue,
          modifiéParValue,
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
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const {
        identifiantProjetValue,
        attestationValue,
        dateConstitutionValue,
        enregistréLeValue,
        enregistréParValue,
      } = getGarantiesFinancièresActuellesData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
        data: {
          identifiantProjetValue,
          attestationValue,
          dateConstitutionValue,
          enregistréLeValue,
          enregistréParValue,
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
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      const {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        dateConstitutionValue,
        attestationValue,
        enregistréLeValue,
        enregistréParValue,
      } = getGarantiesFinancièresActuellesData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
        data: {
          identifiantProjetValue,
          typeValue,
          dateÉchéanceValue,
          dateConstitutionValue,
          attestationValue,
          enregistréLeValue,
          enregistréParValue,
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

      const { identifiantProjetValue, dateÉchéanceValue, échuLeValue } =
        getGarantiesFinancièresActuellesData(identifiantProjet, exemple);

      await mediator.send<GarantiesFinancières.ÉchoirGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières',
        data: {
          identifiantProjetValue,
          dateÉchéanceValue: dateÉchéanceValue!,
          échuLeValue,
        },
      });
      await sleep(100);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
