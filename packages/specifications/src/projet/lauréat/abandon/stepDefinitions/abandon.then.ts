import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';
import { NotFoundError } from '@potentiel-domain/core';
import { expect } from 'chai';

Alors(
  `l'abandon du projet lauréat {string} devrait être consultable dans la liste des projets lauréat abandonnés`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        demande: {
          demandéLe: actualDateDemande,
          demandéPar: actualUtilisateur,
          raison: actualRaison,
          recandidature: actualRecandidature,
          piéceJustificative: actualPiéceJustificative,
        },
      } = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
        },
      });

      const {
        dateDemande,
        utilisateur,
        raison,
        recandidature,
        pièceJustificative: { content },
      } = this.lauréatWorld.abandonWorld;

      actualStatut.estÉgaleÀ(Abandon.StatutAbandon.demandé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identitiantProjetValueType).should.be.true;
      actualDateDemande.estÉgaleÀ(dateDemande).should.be.true;
      actualUtilisateur.estÉgaleÀ(utilisateur).should.be.true;
      actualRaison.should.be.equal(raison);
      actualRecandidature.should.be.equal(recandidature);

      if (actualPiéceJustificative) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'CONSULTER_DOCUMENT_PROJET',
          data: {
            documentKey: actualPiéceJustificative.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);
        actualContent.should.be.equal(content);
      }
    });
  },
);

Alors(
  `l'abandon du projet lauréat {string} ne devrait plus exister`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      try {
        const result = await mediator.send<Abandon.ConsulterAbandonQuery>({
          type: 'CONSULTER_ABANDON_QUERY',
          data: {
            identifiantProjetValue: identitiantProjetValueType.formatter(),
          },
        });
        result.should.be.undefined;
      } catch (e) {
        (e as Error).should.be.instanceOf(NotFoundError);
      }
    });
  },
);

Alors(
  `l'abandon du projet lauréat {string} devrait être rejeté`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        rejet,
      } = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
        },
      });

      const {
        dateRejet,
        utilisateur,
        réponseSignée: { content },
      } = this.lauréatWorld.abandonWorld;

      actualStatut.estÉgaleÀ(Abandon.StatutAbandon.rejeté).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identitiantProjetValueType).should.be.true;
      expect(rejet).to.be.not.undefined;

      const actualDateRejet = rejet!.rejetéLe;
      const actualUtilisateur = rejet!.rejetéPar;
      const actualRéponseSignée = rejet!.réponseSignée;

      actualDateRejet.estÉgaleÀ(dateRejet).should.be.true;
      actualUtilisateur.estÉgaleÀ(utilisateur).should.be.true;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'CONSULTER_DOCUMENT_PROJET',
        data: {
          documentKey: actualRéponseSignée.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      actualContent.should.be.equal(content);
    });
  },
);

Alors(
  `l'abandon du projet lauréat {string} devrait être accordé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        accord,
      } = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
        },
      });

      const {
        dateAccord,
        utilisateur,
        réponseSignée: { content },
      } = this.lauréatWorld.abandonWorld;

      actualStatut.estÉgaleÀ(Abandon.StatutAbandon.accordé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identitiantProjetValueType).should.be.true;
      expect(accord).to.be.not.undefined;

      const actualDateRejet = accord!.accordéLe;
      const actualUtilisateur = accord!.accordéPar;
      const actualRéponseSignée = accord!.réponseSignée;

      actualDateRejet.estÉgaleÀ(dateAccord).should.be.true;
      actualUtilisateur.estÉgaleÀ(utilisateur).should.be.true;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'CONSULTER_DOCUMENT_PROJET',
        data: {
          documentKey: actualRéponseSignée.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      actualContent.should.be.equal(content);
    });
  },
);

Alors(
  `l'abandon du projet lauréat {string} devrait être de nouveau demandé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        rejet,
      } = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
        },
      });

      actualStatut.estÉgaleÀ(Abandon.StatutAbandon.demandé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identitiantProjetValueType).should.be.true;
      expect(rejet).to.be.undefined;
    });
  },
);

Alors(
  `la confirmation d'abandon du projet lauréat {string} devrait être demandée`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        demande,
      } = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
        },
      });

      const {
        dateDemandeConfirmation,
        utilisateur,
        réponseSignée: { content },
      } = this.lauréatWorld.abandonWorld;

      actualStatut.estÉgaleÀ(Abandon.StatutAbandon.confirmationDemandée).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identitiantProjetValueType).should.be.true;

      expect(demande.confirmation).to.be.not.undefined;

      const actualRéponseSignée = demande.confirmation!.réponseSignée;

      demande.confirmation!.demandéLe.estÉgaleÀ(dateDemandeConfirmation).should.be.true;
      demande.confirmation!.demandéPar.estÉgaleÀ(utilisateur).should.be.true;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'CONSULTER_DOCUMENT_PROJET',
        data: {
          documentKey: actualRéponseSignée.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      actualContent.should.be.equal(content);
    });
  },
);

Alors(
  `l'abandon du projet lauréat {string} devrait être confirmé`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identitiantProjetValueType } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const {
        statut: actualStatut,
        identifiantProjet: actualIdentifiantProjet,
        demande,
      } = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identitiantProjetValueType.formatter(),
        },
      });

      const { dateConfirmation, utilisateur } = this.lauréatWorld.abandonWorld;

      actualStatut.estÉgaleÀ(Abandon.StatutAbandon.confirmé).should.be.true;
      actualIdentifiantProjet.estÉgaleÀ(identitiantProjetValueType).should.be.true;

      expect(demande.confirmation?.confirméLe).to.be.not.undefined;
      demande.confirmation!.confirméLe!.estÉgaleÀ(dateConfirmation).should.be.true;

      expect(demande.confirmation?.confirméPar).to.be.not.undefined;
      demande.confirmation!.confirméPar!.estÉgaleÀ(utilisateur).should.be.true;
    });
  },
);

Alors(
  `le projet {string} devrait être la preuve de recandidature suite à l'abandon du projet {string}`,
  async function (
    this: PotentielWorld,
    nomProjetPreuveRecandidature: string,
    nomProjetAbandonné: string,
  ) {
    const { identitiantProjetValueType: identifiantProjetAbandonnéValueType } =
      this.lauréatWorld.rechercherLauréatFixture(nomProjetAbandonné);

    const { identitiantProjetValueType: preuveRecandidatureValueType } =
      this.lauréatWorld.rechercherLauréatFixture(nomProjetPreuveRecandidature);

    await waitForExpect(async () => {
      const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identifiantProjetAbandonnéValueType.formatter(),
        },
      });

      expect(abandon.demande.preuveRecandidature).to.be.not.undefined;

      abandon.demande.preuveRecandidature!.estÉgaleÀ(preuveRecandidatureValueType).should.be.true;
    });
  },
);
