import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import {
  DomainUseCase,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../../helpers/sleep';

Quand(
  `un utilisateur avec le rôle {string} transmet des garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, role: string, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    try {
      const type = exemple['type'];
      const dateÉchéance = exemple[`date d'échéance`];
      const format = exemple['format'];
      const dateConstutition = exemple[`date de constitution`];

      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      if (type === `avec date d'échéance`) {
        await mediator.send<DomainUseCase>({
          type: 'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            attestationGarantiesFinancières: {
              format,
              dateConstitution: convertirEnDateTime(dateConstutition),
            },
            typeGarantiesFinancières: {
              type,
              dateÉchéance: convertirEnDateTime(dateÉchéance),
            },
            identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          },
        });
      }

      //TO DO : cas sans date d'échéance

      await sleep(100);
    } catch (error) {
      console.log('USE CASE ERREUR', error);
      this.error = error as Error;
    }
  },
);
