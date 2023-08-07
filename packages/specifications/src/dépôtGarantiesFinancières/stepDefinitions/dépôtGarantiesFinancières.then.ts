import { Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  loadDépôtGarantiesFinancièresAggregateFactory,
} from '@potentiel/domain';
import {
  ConsulterDépôtGarantiesFinancièresQuery,
  ConsulterFichierDépôtAttestationGarantiesFinancièreQuery,
} from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import { convertReadableToString } from '../../helpers/convertReadableToString';

Alors(
  'les garanties financières devraient être consultables pour le projet {string} avec :',
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // ASSERT ON AGGREGATE

    const expectedAggregate = {
      typeGarantiesFinancières,
      ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
      attestationConstitution: { format, date: convertirEnDateTime(dateConstitution) },
      dateDépôt: new Date().toISOString(),
    };

    const actualAggregate = await loadDépôtGarantiesFinancièresAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualAggregate)) {
      throw new Error(`L'agrégat n'existe pas !`);
    }

    expect(actualAggregate).to.be.deep.equal(expectedAggregate);

    // ASSERT ON READ MODEL

    const expectedReadModel = {
      type: 'garanties-financières',
      typeGarantiesFinancières,
      ...(dateÉchéance && { dateÉchéance: new Date(dateÉchéance).toISOString() }),
      attestationConstitution: { format, date: new Date(dateConstitution).toISOString() },
      dateDépôt: new Date().toISOString(),
    };

    const actuelRealModel = await mediator.send<ConsulterDépôtGarantiesFinancièresQuery>({
      type: 'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(actuelRealModel)) {
      throw new Error('dépôt garanties financières non trouvées');
    }

    expect(actuelRealModel).to.deep.equal(expectedReadModel);

    // ASSERT ON FILE

    const actualFile =
      await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>({
        type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
        data: {
          identifiantProjet,
        },
      });

    if (isNone(actualFile)) {
      throw new Error('dépôt attestation garanties financières non trouvé');
    }

    expect(actualFile.type).to.deep.equal('dépôt-attestation-constitution-garanties-Financieres');
    expect(actualFile.format).to.deep.equal(format);
    expect(await convertReadableToString(actualFile.content)).to.deep.equal(contenu);
  },
);
