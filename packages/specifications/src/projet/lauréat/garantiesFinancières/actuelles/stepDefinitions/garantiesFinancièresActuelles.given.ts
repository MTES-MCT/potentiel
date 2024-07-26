import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import {
  AjouterTâchePlanifiéeCommand,
  ExécuterTâchePlanifiéeUseCase,
} from '@potentiel-domain/tache-planifiee';
import { DateTime } from '@potentiel-domain/common';

import { sleep } from '../../../../../helpers/sleep';
import { PotentielWorld } from '../../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

EtantDonné(
  'des garanties financières actuelles pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'] || 'consignation';
    const dateÉchéance = exemple[`date d'échéance`] || undefined;
    const format = exemple['format'] || 'application/pdf';
    const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
    const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
    const dateSoumission = exemple['date de soumission'] || '2024-01-02';
    const soumisPar = exemple['soumis par'] || 'user@test.test';
    const validéLe = exemple['date de validation'] || '2024-01-03';

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
        dateÉchéanceValue: dateÉchéance && new Date(dateÉchéance).toISOString(),
      },
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        validéLeValue: new Date(validéLe).toISOString(),
        validéParValue: 'dreal@test.test',
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  'des garanties financières actuelles pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const typeGarantiesFinancières = 'consignation';
    const format = 'application/pdf';
    const dateConstitution = '2024-01-01';
    const contenuFichier = 'contenu fichier';
    const dateSoumission = '2024-01-02';
    const soumisPar = 'user@test.test';
    const validéLe = '2024-01-03';

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
      },
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        validéLeValue: new Date(validéLe).toISOString(),
        validéParValue: 'dreal@test.test',
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  `des garanties financières actuelles importées avec l'attestation manquante pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'] || 'consignation';
    const dateÉchéance = exemple[`date d'échéance`] || undefined;

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        typeValue: typeGarantiesFinancières,
        dateÉchéanceValue: dateÉchéance && new Date(dateÉchéance).toISOString(),
        importéLeValue: new Date().toISOString(),
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  `le type des garanties financières actuelles importé pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.ImporterTypeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        typeValue: 'consignation',
        importéLeValue: new Date().toISOString(),
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  'des garanties financières actuelles échues pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const dateÉchéance = new Date(exemple[`date d'échéance`]);
    const typeGarantiesFinancières = 'avec-date-échéance';
    const format = 'application/pdf';
    const dateConstitution = '2024-01-01';
    const contenuFichier = 'contenu fichier';
    const dateSoumission = '2024-01-02';
    const soumisPar = 'user@test.test';
    const validéLe = '2024-01-03';

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
        dateÉchéanceValue: dateÉchéance.toISOString(),
      },
    });

    await sleep(100);

    await mediator.send<GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        validéLeValue: new Date(validéLe).toISOString(),
        validéParValue: 'dreal@test.test',
      },
    });

    await sleep(100);

    const echuLeDate = new Date(dateÉchéance.getTime());
    const echuLeValue = new Date(echuLeDate.setDate(echuLeDate.getDate() + 1));

    await mediator.send<AjouterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
      data: {
        identifiantProjet,
        typeTâchePlanifiée: GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
        àExécuterLe: DateTime.convertirEnValueType(echuLeValue),
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
  },
);
