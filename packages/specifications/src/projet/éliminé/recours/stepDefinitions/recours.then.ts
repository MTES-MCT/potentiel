import { Then as Alors } from "@cucumber/cucumber";
import { mediator } from "mediateur";
import waitForExpect from "wait-for-expect";

import { Recours } from "@potentiel-domain/elimine";
import { ConsulterDocumentProjetQuery } from "@potentiel-domain/document";

import { PotentielWorld } from "../../../../potentiel.world";
import { convertReadableStreamToString } from "../../../../helpers/convertReadableToString";
import { NotFoundError } from "@potentiel-domain/core";
import { expect } from "chai";

Alors(
  `le recours du projet éliminé {string} devrait être consultable dans la liste des recours`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } =
      this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        demande: {
          demandéLe: actualDateDemande,
          demandéPar: actualUtilisateur,
          raison: actualRaison,
          piéceJustificative: actualPiéceJustificative,
        },
      } = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: "Eliminé.Recours.Query.Consulter",
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const {
        dateDemande,
        utilisateur,
        raison,
        pièceJustificative: { content },
      } = this.eliminéWorld.recoursWorld;

      actualStatut.estÉgaleÀ(Recours.StatutRecours.demandé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identifiantProjet).should.be.true;
      actualDateDemande.estÉgaleÀ(dateDemande).should.be.true;
      actualUtilisateur.estÉgaleÀ(utilisateur).should.be.true;
      actualRaison.should.be.equal(raison);

      if (actualPiéceJustificative) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: "CONSULTER_DOCUMENT_PROJET",
          data: {
            documentKey: actualPiéceJustificative.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(
          result.content
        );
        actualContent.should.be.equal(content);
      }
    });
  }
);

Alors(
  `le recours du projet éliminé {string} ne devrait plus exister`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } =
      this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await waitForExpect(async () => {
      try {
        const result = await mediator.send<Recours.ConsulterRecoursQuery>({
          type: "Eliminé.Recours.Query.Consulter",
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });
        result.should.be.undefined;
      } catch (e) {
        (e as Error).should.be.instanceOf(NotFoundError);
      }
    });
  }
);

Alors(
  `le recours du projet éliminé {string} devrait être rejeté`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } =
      this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        rejet,
      } = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: "Eliminé.Recours.Query.Consulter",
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const {
        dateRejet,
        utilisateur,
        réponseSignée: { content },
      } = this.eliminéWorld.recoursWorld;

      actualStatut.estÉgaleÀ(Recours.StatutRecours.rejeté).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identifiantProjet).should.be.true;
      expect(rejet).to.be.not.undefined;

      const actualDateRejet = rejet!.rejetéLe;
      const actualUtilisateur = rejet!.rejetéPar;
      const actualRéponseSignée = rejet!.réponseSignée;

      actualDateRejet.estÉgaleÀ(dateRejet).should.be.true;
      actualUtilisateur.estÉgaleÀ(utilisateur).should.be.true;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: "CONSULTER_DOCUMENT_PROJET",
        data: {
          documentKey: actualRéponseSignée.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      actualContent.should.be.equal(content);
    });
  }
);

Alors(
  `le recours du projet éliminé {string} devrait être accordé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } =
      this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        accord,
      } = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: "Eliminé.Recours.Query.Consulter",
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const {
        dateAccord,
        utilisateur,
        réponseSignée: { content },
      } = this.eliminéWorld.recoursWorld;

      actualStatut.estÉgaleÀ(Recours.StatutRecours.accordé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identifiantProjet).should.be.true;
      expect(accord).to.be.not.undefined;

      const actualDateRejet = accord!.accordéLe;
      const actualUtilisateur = accord!.accordéPar;
      const actualRéponseSignée = accord!.réponseSignée;

      actualDateRejet.estÉgaleÀ(dateAccord).should.be.true;
      actualUtilisateur.estÉgaleÀ(utilisateur).should.be.true;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: "CONSULTER_DOCUMENT_PROJET",
        data: {
          documentKey: actualRéponseSignée.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      actualContent.should.be.equal(content);
    });
  }
);

Alors(
  `le recours du projet éliminé {string} devrait être de nouveau demandé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } =
      this.eliminéWorld.rechercherEliminéFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        rejet,
      } = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: "Eliminé.Recours.Query.Consulter",
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      actualStatut.estÉgaleÀ(Recours.StatutRecours.demandé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identifiantProjet).should.be.true;
      expect(rejet).to.be.undefined;
    });
  }
);
