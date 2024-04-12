import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { expect } from 'chai';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';
import waitForExpect from 'wait-for-expect';
import { NotFoundError } from '@potentiel-domain/core';

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
    const soumisPar = exemple['soumis par'];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      // ASSERT ON READ MODEL
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      const dépôtEnCours = actualReadModel.dépôts.find((dépôt) => dépôt.statut.estEnCours());

      expect(dépôtEnCours).not.to.be.undefined;

      if (dépôtEnCours) {
        expect(dépôtEnCours.type.type).to.deep.equal(typeGarantiesFinancières);
        expect(dépôtEnCours.dateConstitution.date).to.deep.equal(new Date(dateConstitution));
        expect(dépôtEnCours.soumisLe.date).to.deep.equal(new Date(dateSoumission));
        expect(dépôtEnCours.dernièreMiseÀJour.date.date).to.deep.equal(new Date(dateSoumission));
        expect(dépôtEnCours.dernièreMiseÀJour.par.formatter()).to.deep.equal(soumisPar);

        if (dépôtEnCours.dateÉchéance) {
          expect(dépôtEnCours.dateÉchéance.date).to.deep.equal(new Date(dateÉchéance));
        }

        // ASSERT ON FILE
        expect(dépôtEnCours.attestation).not.to.be.undefined;
        expect(dépôtEnCours.attestation.format).to.deep.equal(format);

        if (dépôtEnCours?.attestation) {
          const file = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey: dépôtEnCours.attestation.formatter(),
            },
          });

          const actualContent = await convertReadableStreamToString(file.content);
          actualContent.should.be.equal(contenu);
        }
      }
    });
  },
);

Alors(
  'il ne devrait pas y avoir de garanties financières à traiter pour le projet {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      const dépôtEnCours = actualReadModel.dépôts.find((dépôt) => dépôt.statut.estEnCours());
      expect(dépôtEnCours).to.be.undefined;
    });
  },
);

Alors(
  `les garanties financières validées devraient consultables pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const typeGarantiesFinancières = exemple['type'];
    const dateÉchéance = exemple[`date d'échéance`];
    const format = exemple['format'];
    const dateConstitution = exemple[`date de constitution`];
    const contenu = exemple['contenu fichier'];
    const dateValidation = exemple['date de validation'];
    const dateMiseÀJour = exemple['date dernière mise à jour'];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      // ASSERT ON READ MODEL
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      expect(actualReadModel.actuelles).not.to.be.undefined;
      expect(actualReadModel.actuelles?.type.type).to.deep.equal(typeGarantiesFinancières);
      if (dateÉchéance) {
        expect(actualReadModel.actuelles?.dateÉchéance?.date).to.deep.equal(new Date(dateÉchéance));
      }
      if (dateConstitution) {
        expect(actualReadModel.actuelles?.dateConstitution?.date).to.deep.equal(
          new Date(dateConstitution),
        );
      }
      if (dateMiseÀJour) {
        expect(actualReadModel.actuelles?.dernièreMiseÀJour.date.date).to.deep.equal(
          new Date(dateMiseÀJour),
        );
      }
      if (dateValidation) {
        expect(actualReadModel.actuelles?.validéLe?.date).to.deep.equal(new Date(dateValidation));
      }

      // ASSERT ON FILE
      if (format && contenu) {
        expect(actualReadModel.actuelles?.attestation).not.to.be.undefined;

        if (actualReadModel.actuelles?.attestation) {
          const file = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey: actualReadModel.actuelles?.attestation.formatter(),
            },
          });

          const actualContent = await convertReadableStreamToString(file.content);
          actualContent.should.be.equal(contenu);
        }
      }
    });
  },
);

Alors(
  `il ne devrait pas y avoir d'historique de garanties financières pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      try {
        const result = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

        result.should.be.undefined;
      } catch (e) {
        (e as Error).should.be.instanceOf(NotFoundError);
      }
    });
  },
);

Alors(
  `des garanties financières devraient être attendues pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const exemple = dataTable.rowsHash();
    const dateLimiteSoumission = exemple['date limite de soumission'];
    const motif = exemple['motif'];

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(actualReadModel).not.to.be.undefined;
      expect(actualReadModel.nomProjet).to.deep.equal(nomProjet);
      expect(actualReadModel.motif.motif).to.deep.equal(motif);
      expect(actualReadModel.dateLimiteSoumission.date).to.deep.equal(
        new Date(dateLimiteSoumission),
      );
    });
  },
);

Alors(
  `les garanties financières à traiter du projet {string} devraient être consultable dans la liste des garanties financières à traiter`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
          data: {
            pagination: { page: 1, itemsPerPage: 10 },
            utilisateur: {
              email: 'admin@test.test',
              rôle: 'admin',
            },
          },
        });

      expect(actualReadModel.items[0].identifiantProjet.estÉgaleÀ(identifiantProjet)).to.be.true;
    });
  },
);

Alors(
  `les garanties financières à traiter du projet {string} ne devraient plus être consultable dans la liste des garanties financières à traiter`,
  async function (this: PotentielWorld, nomProjet: string) {
    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerDépôtsEnCoursGarantiesFinancières',
          data: {
            pagination: { page: 1, itemsPerPage: 10 },
            utilisateur: {
              email: 'admin@test.test',
              rôle: 'admin',
            },
          },
        });

      expect(actualReadModel.items).to.be.empty;
    });
  },
);

Alors(
  `les garanties financières en attente du projet {string} ne devraient plus être consultable dans la liste des garanties financières en attente`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      try {
        const result =
          await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
            {
              type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
              data: {
                identifiantProjetValue: identifiantProjet.formatter(),
              },
            },
          );

        result.should.be.undefined;
      } catch (e) {
        (e as Error).should.be.instanceOf(NotFoundError);
      }
    });
  },
);
