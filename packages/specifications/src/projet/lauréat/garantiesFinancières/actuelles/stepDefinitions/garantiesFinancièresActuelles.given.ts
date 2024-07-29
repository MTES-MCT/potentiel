import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { sleep } from '../../../../../helpers/sleep';
import { PotentielWorld } from '../../../../../potentiel.world';
import {
  getDépôtGarantiesFinancièresData,
  getGarantiesFinancièresActuellesData,
} from '../../helpers';

EtantDonné(
  'des garanties financières actuelles pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const {
      identifiantProjetValue,
      typeValue,
      dateÉchéanceValue,
      dateConstitutionValue,
      attestationValue,
      soumisLeValue,
      soumisParValue,
      validéLeValue,
      validéParValue,
    } = getDépôtGarantiesFinancièresData(identifiantProjet, exemple);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        dateConstitutionValue,
        soumisLeValue,
        soumisParValue,
        attestationValue,
      },
    });

    await sleep(300);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue,
        validéLeValue,
        validéParValue,
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  'des garanties financières actuelles pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const {
      identifiantProjetValue,
      attestationValue,
      dateConstitutionValue,
      typeValue,
      soumisLeValue,
      soumisParValue,
      validéLeValue,
      validéParValue,
    } = getDépôtGarantiesFinancièresData(identifiantProjet, {});

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue,
        typeValue,
        dateConstitutionValue,
        soumisLeValue,
        soumisParValue,
        attestationValue,
      },
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue,
        validéLeValue,
        validéParValue,
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  `des garanties financières actuelles importées avec l'attestation manquante pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
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

    await sleep(100);
  },
);

EtantDonné(
  `le type des garanties financières actuelles importé pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const { identifiantProjetValue, typeValue, importéLeValue } =
      getGarantiesFinancièresActuellesData(identifiantProjet, {});

    await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
      data: {
        identifiantProjetValue,
        typeValue,
        importéLeValue,
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  'des garanties financières actuelles échues pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const {
      identifiantProjetValue,
      typeValue,
      dateÉchéanceValue,
      dateConstitutionValue,
      attestationValue,
      soumisLeValue,
      soumisParValue,
      validéLeValue,
      validéParValue,
    } = getDépôtGarantiesFinancièresData(identifiantProjet, exemple);

    await mediator.send<GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      data: {
        identifiantProjetValue,
        typeValue,
        dateÉchéanceValue,
        dateConstitutionValue,
        soumisLeValue,
        soumisParValue,
        attestationValue,
      },
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue,
        validéLeValue,
        validéParValue,
      },
    });

    await sleep(100);

    assert(dateÉchéanceValue, "La date d'échéance est requise");

    const echuLeDate = new Date(new Date(dateÉchéanceValue).getTime());
    const echuLeValue = new Date(echuLeDate.setDate(echuLeDate.getDate() + 1));

    await mediator.send<GarantiesFinancières.ÉchoirGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières',
      data: {
        identifiantProjetValue,
        dateÉchéanceValue: dateÉchéanceValue!,
        échuLeValue: echuLeValue.toISOString(),
      },
    });
  },
);
