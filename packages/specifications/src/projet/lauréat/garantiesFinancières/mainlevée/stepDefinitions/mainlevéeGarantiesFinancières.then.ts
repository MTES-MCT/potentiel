import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';
import { PotentielWorld } from '../../../../../potentiel.world';

import { defaultMainlevéeData } from './helper';

Alors(
  `une demande de mainlevée de garanties financières devrait être consultable pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const motif = exemple['motif'] || defaultMainlevéeData.demande.motif;
    const utilisateur = exemple['utilisateur'] || defaultMainlevéeData.demande.utilisateur;
    const dateDemande = exemple['date demande'] || defaultMainlevéeData.demande.date;

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery>(
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
        await mediator.send<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery>(
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

    const instructionDémarréeLe =
      exemple['instruction démarrée le'] || defaultMainlevéeData.instruction.date;
    const instructionDémarréePar =
      exemple['instruction démarrée par'] || defaultMainlevéeData.instruction.utilisateur;
    const dernièreMiseÀJourLe = exemple['mise à jour le'] || '2024-01-01';
    const dernièreMiseÀJourPar =
      exemple['mise à jour par'] || defaultMainlevéeData.instruction.utilisateur;

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery>(
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

    const accordéLe = exemple['accordé le'];
    const accordéPar = exemple['accordé par'];
    const dernièreMiseÀJourLe = exemple['mise à jour le'];
    const dernièreMiseÀJourPar = exemple['mise à jour par'];
    const format = exemple['format fichier réponse'];
    const content = exemple['contenu fichier réponse'];

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actualReadModel =
        await mediator.send<GarantiesFinancières.ConsulterDemandeEnCoursMainlevéeGarantiesFinancièresQuery>(
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

        const actualGarantiesFinancières =
          await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          });

        expect(Option.isSome(actualGarantiesFinancières)).to.be.true;

        if (Option.isSome(actualGarantiesFinancières)) {
          expect(actualGarantiesFinancières.garantiesFinancières.statut.estLevé()).to.be.true;
        }
      }
    });
  },
);

Alors(
  `une demande de mainlevée de garanties financières devrait être consultable dans l'historique des mainlevées rejetées pour le projet {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const rejetéLe = exemple['rejeté le'];
    const rejetéPar = exemple['rejeté par'];
    const contenuFichierRéponse = exemple['contenu fichier réponse'];
    const formatFichierRéponse = exemple['format fichier réponse'];
    const demandéLe = exemple['demandé le'];
    const demandéPar = exemple['demandé par'];
    const motif = exemple['motif'];

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
        expect(actualReadModel.length).to.equal(1);

        expect(actualReadModel[0].motif.motif).to.deep.equal(motif);

        expect(
          actualReadModel[0].demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(demandéPar)),
        ).to.be.true;

        expect(actualReadModel[0].demande.demandéeLe.date).to.deep.equal(new Date(demandéLe));

        expect(actualReadModel[0].rejet.rejetéLe.date).to.deep.equal(new Date(rejetéLe));

        expect(
          actualReadModel[0].demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(demandéPar)),
        ).to.be.true;

        expect(actualReadModel[0].rejet.rejetéPar.estÉgaleÀ(Email.convertirEnValueType(rejetéPar)))
          .to.be.true;

        expect(actualReadModel[0].rejet.courrierRejet.format).to.deep.equal(formatFichierRéponse);

        const actualFile = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: { documentKey: actualReadModel[0].rejet.courrierRejet.formatter() },
        });
        const actualContent = await convertReadableStreamToString(actualFile.content);
        actualContent.should.be.equal(contenuFichierRéponse);
      }
    });
  },
);
