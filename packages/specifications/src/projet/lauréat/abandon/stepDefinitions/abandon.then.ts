import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

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
        type: 'CONSULTER_ABANDON',
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
        const actual = await mediator.send<Abandon.ConsulterAbandonQuery>({
          type: 'CONSULTER_ABANDON',
          data: {
            identifiantProjetValue: identitiantProjetValueType.formatter(),
          },
        });
      } catch (e) {}
    });
  },
);
