import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { sleep } from '../../../../helpers/sleep';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

EtantDonné(
  `des garanties financières en attente pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const notifiéLe = exemple['date de notification'];
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await mediator.send<GarantiesFinancières.DemanderGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        demandéLeValue: new Date(notifiéLe).toISOString(),
        dateLimiteSoumissionValue: new Date(dateLimiteSoumission).toISOString(),
        motifValue: motif,
      },
    });

    await sleep(500);
  },
);

EtantDonné(
  'des garanties financières à traiter pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'] || 'Consignation';
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

    await sleep(500);
  },
);

EtantDonné(
  'des garanties financières à traiter pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const typeGarantiesFinancières = 'consignation';
    const format = 'application/pdf';
    const dateConstitution = '2024-01-01';
    const contenuFichier = 'contenu fichier';
    const dateSoumission = '2024-01-02';
    const soumisPar = 'user@test.test';

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

    await sleep(500);
  },
);

EtantDonné(
  'des garanties financières validées pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'] || 'consignation';
    const dateÉchéance = exemple[`date d'échéance`] || undefined;
    const format = exemple['format'] || 'application/pdf';
    const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
    const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
    const dateSoumission = exemple['date de soumission'] || '2024-01-02';
    const soumisPar = exemple['soumis par'] || 'user@test.test';
    const validéLe = exemple['date validation'] || '2024-01-03';

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
        ...(dateÉchéance && { dteÉchéanceValue: new Date(dateÉchéance).toISOString() }),
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
  'des garanties financières validées pour le projet {string}',
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
  `des garanties financières importées avec l'attestation manquante pour le projet {string} avec :`,
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
        ...(dateÉchéance && { dteÉchéanceValue: new Date(dateÉchéance).toISOString() }),
        importéLeValue: new Date().toISOString(),
      },
    });

    await sleep(100);
  },
);

EtantDonné(
  `le type de garanties financières importé pour le projet {string}`,
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
