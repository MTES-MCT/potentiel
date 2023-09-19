import { Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  loadGarantiesFinancièresAggregateFactory,
} from '@potentiel/domain';
import {
  ConsulterSuiviDépôtGarantiesFinancièresQuery,
  ListerDépôtsGarantiesFinancièresEnAttenteQuery,
} from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { expect } from 'chai';
import { mediator } from 'mediateur';

Alors(
  `il devrait y avoir un dépôt de garanties financières {string} pour le projet {string} avec :`,
  async function (statutDépôt: string, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const dateLimiteDépôt = exemple[`date limite de dépôt`];
    const région = exemple['région'];

    const {
      identifiantProjet,
      legacyId,
      appelOffre,
      période,
      famille,
      numéroCRE,
      commune,
      département,
    } = this.projetWorld.rechercherProjetFixture(nomProjet);

    // ASSERT ON AGGREGATE

    const actualAggregate = await loadGarantiesFinancièresAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualAggregate)) {
      throw new Error(`L'agrégat n'existe pas !`);
    }

    if (statutDépôt === 'validé') {
      expect(actualAggregate.dateLimiteDépôt).to.be.undefined;
    } else {
      expect(actualAggregate.dateLimiteDépôt).not.to.be.undefined;
      expect(actualAggregate.dateLimiteDépôt?.date).to.be.deep.equal(
        convertirEnDateTime(dateLimiteDépôt).date,
      );
    }

    // ASSERT ON READ MODEL

    const expectedReadModel = {
      type: 'suivi-dépôt-garanties-financières',
      ...(statutDépôt !== 'validé' && {
        dateLimiteDépôt: convertirEnDateTime(dateLimiteDépôt).formatter(),
      }),
      région,
      identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
      statutDépôt,
    };

    const actualReadModel = await mediator.send<ConsulterSuiviDépôtGarantiesFinancièresQuery>({
      type: 'CONSULTER_SUIVI_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(actualReadModel)) {
      throw new Error('read model non trouvé');
    }

    expect(actualReadModel).to.deep.equal(expectedReadModel);

    if (statutDépôt === 'en attente') {
      // ASSERT ON LIST
      const expectedListeReadModel = {
        type: 'liste-suivi-dépôt-garanties-financières-en-attente',
        région,
        liste: [
          {
            dateLimiteDépôt: convertirEnDateTime(dateLimiteDépôt).formatter(),
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
              identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
            },
          },
        ],
        pagination: { currentPage: 1, pageCount: 1, totalCount: 1 },
      };

      const actualListeReadModel =
        await mediator.send<ListerDépôtsGarantiesFinancièresEnAttenteQuery>({
          type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES_EN_ATTENTE',
          data: { région, pagination: { page: 1, itemsPerPage: 10 } },
        });

      expect(actualListeReadModel).to.deep.equal(expectedListeReadModel);
    }
  },
);

Alors(
  `la liste des projets en attente de dépôt de garanties financières pour la région {string} devrait être vide`,
  async function (région: string) {
    const expectedListeReadModel = {
      type: 'liste-suivi-dépôt-garanties-financières-en-attente',
      région,
      liste: [],
      pagination: { currentPage: 1, pageCount: 0, totalCount: 0 },
    };

    const actualListeReadModel =
      await mediator.send<ListerDépôtsGarantiesFinancièresEnAttenteQuery>({
        type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES_EN_ATTENTE',
        data: { région, pagination: { page: 1, itemsPerPage: 10 } },
      });

    expect(actualListeReadModel).to.deep.equal(expectedListeReadModel);
  },
);
