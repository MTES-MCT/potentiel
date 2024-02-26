import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { expect } from 'chai';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  'les garanties financières à traiter devraient être consultables pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateSoumission = exemple['date de soumission'];

    const { identifiantProjet, appelOffre, période } =
      this.lauréatWorld.rechercherLauréatFixture(nomProjet);

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

    const actualListeDépôtsReadModel =
      await mediator.send<GarantiesFinancières.ListerGarantiesFinancièresQuery>({
        type: 'LISTER_GARANTIES_FINANCIÈRES_QUERY',
        data: {
          pagination: { page: 1, itemsPerPage: 10 },
          utilisateur: { email: 'utilisateur@test.test', rôle: 'admin' },
          statut: 'à-traiter',
        },
      });

    expect(actualListeDépôtsReadModel.totalItems).to.deep.equal(1);
    expect(actualListeDépôtsReadModel.items[0]).to.deep.include({
      appelOffre,
      période,
      nomProjet,
    });
    expect(actualListeDépôtsReadModel.items[0].dateDernièreMiseÀJour.formatter()).to.deep.equal(
      new Date(dateSoumission).toISOString(),
    );
    expect(actualListeDépôtsReadModel.items[0].identifiantProjet.formatter()).to.deep.equal(
      identifiantProjet.formatter(),
    );

    expect(actualListeDépôtsReadModel.items[0].àTraiter?.type.type).to.deep.equal(
      typeGarantiesFinancières,
    );
    if (dateÉchéance) {
      expect(actualListeDépôtsReadModel.items[0].àTraiter?.dateÉchéance?.formatter()).to.deep.equal(
        new Date(dateÉchéance).toISOString(),
      );
    }
    expect(
      actualListeDépôtsReadModel.items[0].àTraiter?.dateConstitution.formatter(),
    ).to.deep.equal(new Date(dateConstitution).toISOString());
    expect(actualListeDépôtsReadModel.items[0].àTraiter?.attestation.format).to.deep.equal(format);
  },
);

Alors(
  'des garanties financières devraient être en attente pour le projet {string} avec :',
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const dateLimiteSoumission = exemple['date limite de soumission'];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const actualReadModel =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

    expect(
      actualReadModel.statut.estÉgaleÀ(GarantiesFinancières.StatutGarantiesFinancières.enAttente),
    ).to.be.true;

    expect(actualReadModel.enAttente?.dateLimiteSoumission.date).to.deep.equal(
      new Date(dateLimiteSoumission),
    );
  },
);

Alors(
  'il ne devrait pas y avoir de garanties financières à traiter pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const actualReadModel =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

    expect(actualReadModel.àTraiter).to.be.undefined;
  },
);
