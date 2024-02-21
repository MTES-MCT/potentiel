import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
//import waitForExpect from 'wait-for-expect';

//import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../potentiel.world';
//import { NotFoundError } from '@potentiel-domain/core';
import { expect } from 'chai';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

Alors(
  'les garanties financières devraient être consultables pour le projet "Centrale PV" avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateSoumission = exemple['date de dépôt'];
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

    console.log('READMODEL', actualReadModel.àTraiter);

    expect(actualReadModel.àTraiter).to.deep.equal({
      type: typeGarantiesFinancières,
      dateÉchéance,
    });

    // ASSERT ON FILE

    // const actualFile =
    //   await mediator.send<ConsulterFichierDépôtAttestationGarantiesFinancièreQuery>({
    //     type: 'CONSULTER_DÉPÔT_ATTESTATION_GARANTIES_FINANCIÈRES',
    //     data: {
    //       identifiantProjet,
    //     },
    //   });

    // if (isNone(actualFile)) {
    //   throw new Error('fichier dépôt attestation garanties financières non trouvé');
    // }

    // expect(actualFile.type).to.deep.equal('depot-attestation-constitution-garanties-financieres');
    // expect(actualFile.format).to.deep.equal(format);
    // expect(await convertReadableStreamToString(actualFile.content)).to.deep.equal(contenu);

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
