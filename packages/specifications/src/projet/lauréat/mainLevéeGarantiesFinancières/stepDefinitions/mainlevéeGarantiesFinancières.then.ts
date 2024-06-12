import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../../../../potentiel.world';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

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

    const accordéLe = exemple['accordé le'] || '2024-01-01';
    const accordéPar = exemple['accordé par'] || 'user@test.test';
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
          actualReadModel.accord?.accordéePar.estÉgaleÀ(Email.convertirEnValueType(accordéPar)),
        ).to.be.true;

        expect(actualReadModel.accord?.accordéeLe.date).to.deep.equal(new Date(accordéLe));

        expect(
          actualReadModel.accord?.accordéePar.estÉgaleÀ(Email.convertirEnValueType(accordéPar)),
        ).to.be.true;

        actualReadModel.accord?.accordéePar;

        expect(actualReadModel.accord?.accordéeLe.date).to.deep.equal(new Date(accordéLe));
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
