import { Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  loadGarantiesFinancièresAggregateFactory,
} from '@potentiel/domain';
import {
  ConsulterDépôtGarantiesFinancièresQuery,
  ConsulterFichierDépôtAttestationGarantiesFinancièreQuery,
  ListerDépôtsGarantiesFinancièresQuery,
} from '@potentiel/domain-views';
import { isNone, none } from '@potentiel/monads';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import { convertReadableStreamToString } from '../../../helpers/convertReadableToString';

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
    const dateDernièreModification = exemple['date dernière modification'];
    const région = exemple['région'];
    const dateLimiteDépôt = exemple['date limite de dépôt'];

    const {
      identifiantProjet,
      legacyId,
      appelOffre,
      période,
      famille,
      numéroCRE,
      commune,
      département,
      statut,
    } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // ASSERT ON AGGREGATE

    const expectedDépôtAggregate = {
      typeGarantiesFinancières,
      ...(dateÉchéance && { dateÉchéance: convertirEnDateTime(dateÉchéance) }),
      attestationConstitution: { format, date: convertirEnDateTime(dateConstitution) },
      dateDépôt: convertirEnDateTime(dateDépôt),
    };

    const actualAggregate = await loadGarantiesFinancièresAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualAggregate)) {
      throw new Error(`L'agrégat n'existe pas !`);
    }

    expect(actualAggregate.dépôt).not.to.be.undefined;

    expect(actualAggregate.dépôt?.attestationConstitution?.format).to.be.deep.equal(
      expectedDépôtAggregate.attestationConstitution?.format,
    );

    expect(actualAggregate.dépôt?.attestationConstitution?.date.date.getTime()).to.be.deep.equal(
      expectedDépôtAggregate.attestationConstitution.date.date.getTime(),
    );

    expect(actualAggregate.dépôt?.dateDépôt?.date.getTime()).to.be.deep.equal(
      expectedDépôtAggregate.dateDépôt.date.getTime(),
    );

    expect(actualAggregate.dépôt?.typeGarantiesFinancières).to.be.deep.equal(
      expectedDépôtAggregate.typeGarantiesFinancières,
    );

    expect(actualAggregate.dépôt?.dateÉchéance?.date.getTime()).to.be.deep.equal(
      expectedDépôtAggregate.dateÉchéance?.date.getTime(),
    );

    // ASSERT ON READ MODEL

    const expectedReadModel = {
      type: 'dépôt-garanties-financières',
      ...(typeGarantiesFinancières && { typeGarantiesFinancières }),
      ...(dateÉchéance && { dateÉchéance: new Date(dateÉchéance).toISOString() }),
      attestationConstitution: { format, date: new Date(dateConstitution).toISOString() },
      dateDépôt: new Date(dateDépôt).toISOString(),
      dateDernièreMiseÀJour: dateDernièreModification
        ? new Date(dateDernièreModification).toISOString()
        : new Date(dateDépôt).toISOString(),
      région,
      identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
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
    expect(await convertReadableStreamToString(actualFile.content)).to.deep.equal(contenu);

    // ASSERT ON LIST

    const expectedListeDépôtsReadModel = {
      type: 'liste-dépôts-garanties-financières',
      région,
      liste: [
        {
          dépôt: expectedReadModel,
          projet: {
            legacyId,
            nom: nomProjet,
            appelOffre,
            période,
            famille,
            numéroCRE,
            localité: {
              commune,
              région,
              département,
            },
            statut,
            identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
          },
        },
      ],
      pagination: { currentPage: 1, pageCount: 1 },
    };

    const actualListeDépôtsReadModel = await mediator.send<ListerDépôtsGarantiesFinancièresQuery>({
      type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
      data: { région, pagination: { page: 1, itemsPerPage: 10 } },
    });

    expect(actualListeDépôtsReadModel).to.deep.equal(expectedListeDépôtsReadModel);
  },
);

Alors(
  'le dépôt de garanties financières devrait être supprimé pour le projet {string}',
  async function (nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // ASSERT ON AGGREGATE

    const actualAggregate = await loadGarantiesFinancièresAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualAggregate)) {
      throw new Error(`L'agrégat n'existe pas !`);
    }

    expect(actualAggregate.dépôt).to.be.undefined;

    // ASSERT ON READ MODEL

    const actualRealModel = await mediator.send<ConsulterDépôtGarantiesFinancièresQuery>({
      type: 'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    expect(actualRealModel).to.deep.equal(none);

    // ASSERT ON FILE

    const actualFile =
      await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>({
        type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
        data: {
          identifiantProjet,
        },
      });

    expect(actualFile).to.deep.equal(none);
  },
);

Alors(
  'les porteurs du projet devraient être notifiés que le dépôt de garanties financières pour le projet {string} a été validé avec :',
  async function (nomProjet: string, table: DataTable) {
    const expectedPorteursNotifiés = table.rows().map(([name, email]) => ({
      name,
      email,
    }));

    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    expect(true);
  },
);
