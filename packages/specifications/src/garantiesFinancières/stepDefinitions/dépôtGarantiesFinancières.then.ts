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
  'le dépôt de garanties financières devrait être (consultable )(mis à jour )pour le projet {string} avec :',
  async function (nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateDépôt = exemple['date de dépôt'];

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // ASSERT ON AGGREGATE

    const expectedAggregate = {
      typeGarantiesFinancières,
      ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
      attestationConstitution: { format, date: convertirEnDateTime(dateConstitution) },
      dateDépôt: convertirEnDateTime(dateDépôt),
    };

    const actualAggregate = await loadDépôtGarantiesFinancièresAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualAggregate)) {
      throw new Error(`L'agrégat n'existe pas !`);
    }

    expect(actualAggregate.dépôt).not.to.be.undefined;

    expect(actualAggregate?.dépôt?.attestationConstitution?.format).to.be.deep.equal(
      expectedAggregate.attestationConstitution?.format,
    );

    expect(actualAggregate?.dépôt?.attestationConstitution?.date.date.getTime()).to.be.deep.equal(
      expectedAggregate.attestationConstitution.date.date.getTime(),
    );

    expect(actualAggregate?.dépôt?.dateDépôt?.date.getTime()).to.be.deep.equal(
      expectedAggregate.dateDépôt.date.getTime(),
    );

    expect(actualAggregate?.dépôt?.typeGarantiesFinancières).to.be.deep.equal(
      expectedAggregate.typeGarantiesFinancières,
    );

    expect(actualAggregate?.dépôt?.dateÉchéance?.date.getTime()).to.be.deep.equal(
      expectedAggregate.dateÉchéance?.date.getTime(),
    );

    // ASSERT ON READ MODEL

    const expectedReadModel = {
      type: 'dépôt-garanties-financières',
      ...(typeGarantiesFinancières && { typeGarantiesFinancières }),
      ...(dateÉchéance && { dateÉchéance: new Date(dateÉchéance).toISOString() }),
      attestationConstitution: { format, date: new Date(dateConstitution).toISOString() },
      dateDépôt: new Date(dateDépôt).toISOString(),
    };

    const actualRealModel = await mediator.send<ConsulterDépôtGarantiesFinancièresQuery>({
      type: 'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(actualRealModel)) {
      throw new Error('dépôt garanties financières non trouvé (readmodel)');
    }

    expect(actualRealModel).to.deep.equal(expectedReadModel);

    // ASSERT ON FILE

    const actualFile =
      await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>({
        type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
        data: {
          identifiantProjet,
        },
      });

    if (isNone(actualFile)) {
      throw new Error('fichier dépôt attestation garanties financières non trouvé');
    }

    expect(actualFile.type).to.deep.equal('depot-attestation-constitution-garanties-financieres');
    expect(actualFile.format).to.deep.equal(format);
    expect(await convertReadableToString(actualFile.content)).to.deep.equal(contenu);
  },
);
