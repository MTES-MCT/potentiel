import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import {
  DomainUseCase,
  TypeGarantiesFinancières,
  Utilisateur,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../../helpers/sleep';
import { convertStringToReadable } from '../../../helpers/convertStringToReadable';

Quand(
  `un utilisateur avec le rôle {string} transmet des garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, rôle: string, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
      const typeGarantiesFinancières = exemple['type'] as TypeGarantiesFinancières;
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstutition = exemple[`date de constitution`];
      const contenuFichier = convertStringToReadable(exemple['contenu fichier']);

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      await mediator.send<DomainUseCase>({
        type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
        data: {
          ...(format &&
            dateConstutition && {
              attestationConstitution: {
                format,
                date: convertirEnDateTime(dateConstutition),
                content: contenuFichier,
              },
            }),
          ...(typeGarantiesFinancières && {
            typeGarantiesFinancières,
            ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
          }),
          utilisateur: { rôle } as Utilisateur,
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        },
      });
      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
