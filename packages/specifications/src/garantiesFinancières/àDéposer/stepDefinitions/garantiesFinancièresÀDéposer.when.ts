import { DataTable, When as Quand } from '@cucumber/cucumber';
import {
  GarantiesFinancièresSnapshotEventV1,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  createGarantiesFinancièresAggregateId,
} from '@potentiel/domain';
import { sleep } from '../../../helpers/sleep';
import { publish } from '@potentiel/pg-event-sourcing';

Quand(
  `un développeur migre des garanties financières à déposer pour le projet {string} avec :`,
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const dateLimiteDépôt = exemple[`date limite de dépôt`];
      const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

      const event: GarantiesFinancièresSnapshotEventV1 = {
        type: 'GarantiesFinancièresSnapshot-v1',
        payload: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          aggregate: {
            dateLimiteDépôt: convertirEnDateTime(dateLimiteDépôt).formatter(),
          },
        },
      };

      await publish(
        createGarantiesFinancièresAggregateId(convertirEnIdentifiantProjet(identifiantProjet)),
        event,
      );

      await sleep(500);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
