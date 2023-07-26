import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../../potentiel.world';
import { isNone } from '@potentiel/monads';
import { expect } from 'chai';
import { convertirEnIdentifiantProjet, loadProjetAggregateFactory } from '@potentiel/domain';
import { loadAggregate } from '@potentiel/pg-event-sourcing';

Alors(
  `les garanties financières du projet {string} devraient être consultable dans le projet`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const type = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // Assert on aggregate

    const actualProjetAggregate = await loadProjetAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantProjet(identifiantProjet),
    );

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat projet n'existe pas !`);
    }

    expect(actualProjetAggregate.garantiesFinancières).not.to.be.undefined;

    if (type) {
      expect(actualProjetAggregate.garantiesFinancières?.type).to.equals(type);
    }

    if (dateÉchéance) {
      expect(actualProjetAggregate.garantiesFinancières?.dateÉchéance?.date.getTime()).to.equals(
        new Date(dateÉchéance).getTime(),
      );
    } else {
      expect(actualProjetAggregate.garantiesFinancières?.dateÉchéance).to.be.undefined;
    }

    if (format) {
      expect(actualProjetAggregate.garantiesFinancières?.attestation?.format).to.equals(format);
    }

    if (dateConstitution) {
      expect(
        actualProjetAggregate.garantiesFinancières?.attestation?.dateConstitution.date.getTime(),
      ).to.equals(new Date(dateConstitution).getTime());
    }
  },
);
