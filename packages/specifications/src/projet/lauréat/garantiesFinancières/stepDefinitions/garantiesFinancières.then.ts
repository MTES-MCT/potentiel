import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
//import waitForExpect from 'wait-for-expect';

//import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../potentiel.world';
//import { NotFoundError } from '@potentiel-domain/core';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { expect } from 'chai';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  'les garanties financières devraient être consultables pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateSoumission = exemple['date de soumission'];
    const région = exemple['région'];

    const {
      identifiantProjet,
      // legacyId,
      // appelOffre,
      // période,
      // famille,
      // numéroCRE,
      // commune,
      // département,
      // statut,
    } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    // ASSERT ON READ MODEL

    const actualReadModel =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

    expect(actualReadModel.àTraiter?.type.type).to.deep.equal(typeGarantiesFinancières);
    if (dateÉchéance) {
      expect(actualReadModel.àTraiter?.dateÉchéance?.date).to.deep.equal(new Date(dateÉchéance));
    }
    expect(actualReadModel.àTraiter?.dateConstitution?.date).to.deep.equal(
      new Date(dateConstitution),
    );
    expect(actualReadModel.àTraiter?.soumisLe?.date).to.deep.equal(new Date(dateSoumission));

    // ASSERT ON FILE

    if (actualReadModel.àTraiter?.attestation) {
      const file = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'CONSULTER_DOCUMENT_PROJET',
        data: {
          documentKey: actualReadModel.àTraiter?.attestation.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(file.content);
      actualContent.should.be.equal(contenu);
    }

    // ASSERT ON LIST

    // const expectedListeDépôtsReadModel = {
    //   type: 'liste-dépôts-garanties-financières',
    //   région,
    //   liste: [
    //     {
    //       dépôt: expectedReadModel,
    //       projet: {
    //         legacyId,
    //         nom: nomProjet,
    //         appelOffre,
    //         période,
    //         famille,
    //         numéroCRE,
    //         localité: {
    //           commune,
    //           région,
    //           département,
    //         },
    //         statut,
    //         identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet).formatter(),
    //       },
    //     },
    //   ],
    //   pagination: { currentPage: 1, pageCount: 1, totalCount: 1 },
    // };

    // const actualListeDépôtsReadModel = await mediator.send<ListerDépôtsGarantiesFinancièresQuery>({
    //   type: 'LISTER_DÉPÔTS_GARANTIES_FINANCIÈRES',
    //   data: { région, pagination: { page: 1, itemsPerPage: 10 } },
    // });

    // expect(actualListeDépôtsReadModel).to.deep.equal(expectedListeDépôtsReadModel);
  },
);
