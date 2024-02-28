import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { sleep } from '../../../../helpers/sleep';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

Quand(
  'le porteur soumet des garanties financières pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] || 'consignation';
      const dateÉchéance = exemple[`date d'échéance`] || undefined;
      const format = exemple['format'] || 'application/pdf';
      const dateConstitution = exemple[`date de constitution`] || '2024-01-01';
      const contenuFichier = exemple['contenu fichier'] || 'contenu fichier';
      const dateSoumission = exemple['date de soumission'] || '2024-01-02';
      const soumisPar = exemple['soumis par'] || 'user@test.test';

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.SoumettreGarantiesFinancièresUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SoumettreGarantiesFinancières',
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
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur supprime les garanties financières à traiter pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    try {
      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.SupprimerGarantiesFinancièresÀTraiterUseCase>({
        type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancières',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue: 'porteur@test.test',
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
