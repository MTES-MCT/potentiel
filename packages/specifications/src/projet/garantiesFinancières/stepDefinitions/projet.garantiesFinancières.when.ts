import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import { DomainUseCase } from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../../helpers/sleep';

Quand(
  `un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();

    try {
      const type = exemple['type'];
      const dateEchéance = exemple[`date d'échéance`];
      const attestation = {
        format: exemple['format'],
        dateConstutition: exemple[`date de constitution`],
      };

      const garantiesFinancières = {
        type,
        dateEchéance,
        attestation,
      };

      await mediator.send<DomainUseCase>({
        type: 'ENREGISTRER_GARANTIES_FINANCIERES_USECASE',
        data: garantiesFinancières,
      });

      await sleep(100);
    } catch (error) {
      this.error = error as Error;
    }
  },
);
