import { DataTable, When as Quand } from '@cucumber/cucumber';
import {
  DomainUseCase,
  TypeGarantiesFinancières,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { convertStringToReadable } from '../../helpers/convertStringToReadable';
import { sleep } from '../../helpers/sleep';
import { mediator } from 'mediateur';

Quand(
  'un utilisateur avec le rôle {string} dépose des garanties financières pour le projet {string} avec :',
  async function (rôle: string, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstutition = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadable(exemple['contenu fichier']);
      const dateDépôt = exemple['date de dépôt'];

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          attestationConstitution: {
            format,
            date: convertirEnDateTime(dateConstutition),
            content: contenuFichier,
          },
          typeGarantiesFinancières,
          ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
          utilisateur: { rôle } as Utilisateur,
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          dateDépôt: convertirEnDateTime(dateDépôt),
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
