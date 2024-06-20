import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';
import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  `une demande de mainlevée de garanties financières devrait être consultable pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const motif = exemple['motif'] || 'projet-abandonné';
    const utilisateur = exemple['utilisateur'] || 'user@test.test';
    const dateDemande = exemple['date demande'] || '2024-01-01';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(Option.isSome(actualReadModel)).to.be.true;

      if (Option.isSome(actualReadModel)) {
        expect(
          actualReadModel.motif.estÉgaleÀ(
            GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
              motif,
            ),
          ),
        ).to.be.true;

        expect(
          actualReadModel.demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(utilisateur)),
        ).to.be.true;

        expect(actualReadModel.demande.demandéeLe.date).to.deep.equal(new Date(dateDemande));

        expect(actualReadModel.statut.estDemandé()).to.be.true;
      }
    });
  },
);

Alors(
  `une demande de mainlevée de garanties financières ne devrait plus être consultable pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(Option.isNone(actualReadModel)).to.be.true;
    });
  },
);

Alors(
  `une demande de mainlevée de garanties financières en instruction devrait être consultable pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const instructionDémarréeLe = exemple['instruction démarrée le'] || '2024-01-01';
    const instructionDémarréePar = exemple['instruction démarrée par'] || 'user@test.test';
    const dernièreMiseÀJourLe = exemple['mise à jour le'] || '2024-01-01';
    const dernièreMiseÀJourPar = exemple['mise à jour par'] || 'user@test.test';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(Option.isSome(actualReadModel)).to.be.true;

      if (Option.isSome(actualReadModel)) {
        expect(actualReadModel.statut.estEnInstruction()).to.be.true;

        expect(
          actualReadModel.instruction?.démarréePar.estÉgaleÀ(
            Email.convertirEnValueType(instructionDémarréePar),
          ),
        ).to.be.true;

        expect(
          actualReadModel.dernièreMiseÀJour.par.estÉgaleÀ(
            Email.convertirEnValueType(dernièreMiseÀJourPar),
          ),
        ).to.be.true;

        expect(actualReadModel.instruction?.démarréeLe.date).to.deep.equal(
          new Date(instructionDémarréeLe),
        );

        expect(actualReadModel.dernièreMiseÀJour.date.date).to.deep.equal(
          new Date(dernièreMiseÀJourLe),
        );
      }
    });
  },
);

Alors(
  `une demande de mainlevée de garanties financières accordée devrait être consultable pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const accordéeLe = exemple['accordée le'] || '2024-01-01';
    const accordéePar = exemple['accordée par'] || 'user@test.test';
    const dernièreMiseÀJourLe = exemple['mise à jour le'] || '2024-01-01';
    const dernièreMiseÀJourPar = exemple['mise à jour par'] || 'user@test.test';
    const format = exemple['format fichier réponse'] || 'application/pdf';
    const content = exemple['contenu fichier réponse'] || 'contenu du fichier';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeMainlevéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(Option.isSome(actualReadModel)).to.be.true;

      if (Option.isSome(actualReadModel)) {
        expect(actualReadModel.statut.estAccordé()).to.be.true;

        expect(
          actualReadModel.accord?.accordéePar.estÉgaleÀ(Email.convertirEnValueType(accordéePar)),
        ).to.be.true;

        expect(actualReadModel.accord?.accordéeLe.date).to.deep.equal(new Date(accordéeLe));

        expect(actualReadModel.dernièreMiseÀJour.date.date).to.deep.equal(
          new Date(dernièreMiseÀJourLe),
        );

        expect(
          actualReadModel.dernièreMiseÀJour.par.estÉgaleÀ(
            Email.convertirEnValueType(dernièreMiseÀJourPar),
          ),
        ).to.be.true;

        expect(actualReadModel.accord?.courrierAccord.format).to.deep.equal(format);

        if (actualReadModel.accord) {
          const actualFile = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: { documentKey: actualReadModel.accord?.courrierAccord.formatter() },
          });
          const actualContent = await convertReadableStreamToString(actualFile.content);
          actualContent.should.be.equal(content);
        }
      }
    });
  },
);

Alors(
  `une demande de mainlevée pour le projet {string} devrait être consultable dans la liste des demandes de mainlevée`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel = await mediator.send<GarantiesFinancières.ListerDemandeMainlevéeQuery>(
        {
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            utilisateur: {
              email: 'admin@test.test',
              rôle: 'admin',
            },
          },
        },
      );

      expect(actualReadModel.items[0].identifiantProjet.estÉgaleÀ(identifiantProjet)).to.be.true;
    });
  },
);

Alors(
  `une demande de mainlevée de garanties financières rejetée devrait être consultable dans l'historique des mainlevées rejetées pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const rejetéeLe = exemple['rejetée le'];
    const rejetéePar = exemple['rejetée par'];
    const contenuFichierRéponse = exemple['contenu fichier réponse'];
    const formatFichierRéponse = exemple['format fichier réponse'];
    const demandéeLe = exemple['demandée le'];
    const demandéePar = exemple['demandée par'];
    const motif = exemple['motif'];
    const miseAJourLe = exemple['mise à jour le'];
    const miseAJourPar = exemple['mise à jour par'];

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterHistoriqueDemandeMainlevéeRejetéeGarantiesFinancièresQuery>(
          {
            type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.ConsulterHistoriqueDemandeMainlevéeRejetée',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      expect(Option.isSome(actualReadModel)).to.be.true;

      if (Option.isSome(actualReadModel)) {
        expect(actualReadModel.identifiantProjet.estÉgaleÀ(identifiantProjet)).to.be.true;

        expect(actualReadModel.historique[0].motif.motif).to.deep.equal(motif);

        expect(actualReadModel.historique[0].demande.demandéeLe.date).to.deep.equal(
          new Date(demandéeLe),
        );

        expect(
          actualReadModel.historique[0].demande.demandéePar.estÉgaleÀ(
            Email.convertirEnValueType(demandéePar),
          ),
        ).to.be.true;

        expect(
          actualReadModel.historique[0].dernièreMiseÀJour.date.estÉgaleÀ(
            DateTime.convertirEnValueType(miseAJourLe),
          ),
        ).to.be.true;

        expect(
          actualReadModel.historique[0].dernièreMiseÀJour.par.estÉgaleÀ(
            Email.convertirEnValueType(miseAJourPar),
          ),
        ).to.be.true;

        expect(actualReadModel.historique[0].rejet.rejetéeLe.date).to.deep.equal(
          new Date(rejetéeLe),
        );

        expect(
          actualReadModel.historique[0].rejet.rejetéePar.estÉgaleÀ(
            Email.convertirEnValueType(rejetéePar),
          ),
        ).to.be.true;

        expect(actualReadModel.historique[0].rejet.courrierRejet.format).to.deep.equal(
          formatFichierRéponse,
        );

        const actualFile = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: { documentKey: actualReadModel.historique[0].rejet.courrierRejet.formatter() },
        });

        const actualContent = await convertReadableStreamToString(actualFile.content);
        actualContent.should.be.equal(contenuFichierRéponse);
      }
    });
  },
);
