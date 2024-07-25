import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { sleep } from '../../../../../helpers/sleep';
import { PotentielWorld } from '../../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

EtantDonné(
  'un dépôt de garanties financières pour le projet {string} avec :',
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
  'un dépôt de garanties financières pour le projet {string}',
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
