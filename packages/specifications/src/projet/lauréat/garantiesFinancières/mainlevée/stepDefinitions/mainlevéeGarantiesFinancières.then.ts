import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Option } from '@potentiel-libraries/monads';
import { Email } from '@potentiel-domain/common';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

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
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé.statut,
          },
        });

      expect(actualReadModel.items).to.be.length(1);

      if (actualReadModel.items.length) {
        const mainlevée = actualReadModel.items[0];

        expect(
          mainlevée.motif.estÉgaleÀ(
            Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
              motif,
            ),
          ),
        ).to.be.true;

        expect(mainlevée.demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(utilisateur))).to
          .be.true;

        expect(mainlevée.demande.demandéeLe.date).to.deep.equal(new Date(dateDemande));

        expect(mainlevée.statut.estDemandé()).to.be.true;
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
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            estEnCours: true,
          },
        });

      expect(actualReadModel.items).to.be.length(0);
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
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            statut:
              Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction.statut,
          },
        });

      expect(actualReadModel.items).to.be.length(1);

      if (actualReadModel.items.length) {
        const mainlevée = actualReadModel.items[0];

        expect(
          mainlevée.instruction?.démarréePar.estÉgaleÀ(
            Email.convertirEnValueType(instructionDémarréePar),
          ),
        ).to.be.true;

        expect(
          mainlevée.dernièreMiseÀJour.par.estÉgaleÀ(
            Email.convertirEnValueType(dernièreMiseÀJourPar),
          ),
        ).to.be.true;

        expect(mainlevée.instruction?.démarréeLe.date).to.deep.equal(
          new Date(instructionDémarréeLe),
        );

        expect(mainlevée.dernièreMiseÀJour.date.date).to.deep.equal(new Date(dernièreMiseÀJourLe));
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
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.accordé.statut,
          },
        });

      expect(actualReadModel.items).to.be.length(1);

      if (actualReadModel.items.length) {
        const mainlevée = actualReadModel.items[0];

        expect(mainlevée.statut.estAccordé()).to.be.true;

        expect(mainlevée.accord?.accordéePar.estÉgaleÀ(Email.convertirEnValueType(accordéPar))).to
          .be.true;

        expect(mainlevée.accord?.accordéeLe.date).to.deep.equal(new Date(accordéLe));

        expect(mainlevée.accord?.accordéePar.estÉgaleÀ(Email.convertirEnValueType(accordéPar))).to
          .be.true;

        mainlevée.accord?.accordéePar;

        expect(mainlevée.accord?.accordéeLe.date).to.deep.equal(new Date(accordéLe));
        expect(mainlevée.dernièreMiseÀJour.date.date).to.deep.equal(new Date(dernièreMiseÀJourLe));
        expect(
          mainlevée.dernièreMiseÀJour.par.estÉgaleÀ(
            Email.convertirEnValueType(dernièreMiseÀJourPar),
          ),
        ).to.be.true;
        expect(mainlevée.accord?.courrierAccord.format).to.deep.equal(format);

        if (mainlevée.accord) {
          const actualFile = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: { documentKey: mainlevée.accord?.courrierAccord.formatter() },
          });

          assert(Option.isSome(actualFile), `Courrier accord non trouvé !`);

          const actualContent = await convertReadableStreamToString(actualFile.content);
          actualContent.should.be.equal(content);
        }

        const actualGarantiesFinancières =
          await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
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
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Lister',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
          },
        });

      expect(actualReadModel.items).to.be.length(1);

      if (actualReadModel.items.length) {
        const mainlevée = actualReadModel.items[0];

        expect(mainlevée.motif.motif).to.deep.equal(motif);

        expect(mainlevée.demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(demandéPar))).to
          .be.true;

        expect(mainlevée.demande.demandéeLe.date).to.deep.equal(new Date(demandéLe));

        expect(mainlevée.rejet?.rejetéLe.date).to.deep.equal(new Date(rejetéLe));

        expect(mainlevée.demande.demandéePar.estÉgaleÀ(Email.convertirEnValueType(demandéPar))).to
          .be.true;

        expect(mainlevée.rejet?.rejetéPar.estÉgaleÀ(Email.convertirEnValueType(rejetéPar))).to.be
          .true;

        expect(mainlevée.rejet?.courrierRejet.format).to.deep.equal(formatFichierRéponse);

        if (mainlevée.rejet) {
          const actualFile = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: { documentKey: mainlevée.rejet.courrierRejet.formatter() },
          });

          assert(Option.isSome(actualFile), `Courrier rejet non trouvé !`);

          const actualContent = await convertReadableStreamToString(actualFile.content);
          actualContent.should.be.equal(contenuFichierRéponse);
        }
      }
    });
  },
);
