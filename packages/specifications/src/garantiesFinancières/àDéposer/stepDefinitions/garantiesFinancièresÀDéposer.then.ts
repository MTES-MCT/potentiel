import { Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  loadGarantiesFinancièresAggregateFactory,
} from '@potentiel/domain';
import {
  ConsulterGarantiesFinancièresÀDéposerQuery,
  ListerGarantiesFinancièresÀDéposerQuery,
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
      statut,
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
      type: 'garanties-financières-à-déposer',
      dateLimiteDépôt: convertirEnDateTime(dateLimiteDépôt).formatter(),
      région,
      identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
      statutDépôt,
    };

    const actualRealModel = await mediator.send<ConsulterGarantiesFinancièresÀDéposerQuery>({
      type: 'CONSULTER_GARANTIES_FINANCIÈRES_À_DÉPOSER',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(actualRealModel)) {
      throw new Error('read model non trouvé');
    }

    expect(actualRealModel).to.deep.equal(expectedReadModel);

    if (statutDépôt === 'en attente') {
      // ASSERT ON LIST
      const expectedListeReadModel = {
        type: 'liste-garanties-financières-à-déposer',
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
              statut,
              identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
            },
          },
        ],
        pagination: { currentPage: 1, pageCount: 1 },
      };

      const actualListeReadModel = await mediator.send<ListerGarantiesFinancièresÀDéposerQuery>({
        type: 'LISTER_GARANTIES_FINANCIÈRES_À_DÉPOSER',
        data: { région, pagination: { page: 1, itemsPerPage: 10 } },
      });

      expect(actualListeReadModel).to.deep.equal(expectedListeReadModel);
    }
  },
);
