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
      const typeGarantiesFinancières = exemple['type'];
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstitution = exemple[`date de constitution`];
      const contenuFichier = exemple['contenu fichier'];
      const dateSoumission = exemple['date de soumission'];
      const soumisPar = exemple['soumis par'];

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<GarantiesFinancières.SoumettreGarantiesFinancièresUseCase>({
        type: 'SOUMETTRE_GARANTIES_FINANCIÈRES_USECASE',
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
      console.log('ERREUR when', error);
      this.error = error as Error;
    }
  },
);
