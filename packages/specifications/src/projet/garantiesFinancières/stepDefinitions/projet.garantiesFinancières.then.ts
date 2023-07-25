import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import { mediator } from 'mediateur';
import { ConsulterProjetQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { expect } from 'chai';
import { convertirEnDateTime } from '@potentiel/domain';

Alors(
  `les garanties financières du projet {string} devraient être consultable dans le projet`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const type = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // TO DO : Assert on aggregate

    // Assert on read model
    const résultat = await mediator.send<ConsulterProjetQuery>({
      type: 'CONSULTER_PROJET',
      data: { identifiantProjet },
    });

    if (isNone(résultat)) {
      throw new Error('Projet non trouvé');
    }

    expect(résultat.garantiesFinancières).to.deep.equal({
      dateÉchéance: convertirEnDateTime(dateÉchéance).formatter(),
      type,
      attestation: {
        format,
        dateConstitution: convertirEnDateTime(dateConstitution).formatter(),
      },
    });
  },
);
