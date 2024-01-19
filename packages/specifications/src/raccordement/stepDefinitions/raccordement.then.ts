import { Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { mediator } from 'mediateur';
import { Raccordement } from '@potentiel-domain/reseau';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
        type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      actual.dossiers
        .map((d) => d.référence.formatter())
        .should.contain(this.raccordementWorld.référenceDossierRaccordement.formatter());
    });
  },
);

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      const {
        référence: actualRéférence,
        demandeComplèteRaccordement: {
          accuséRéception: actualAccuséRéception,
          dateQualification: actualDateQualification,
        },
      } = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue:
            this.raccordementWorld.référenceDossierRaccordement.formatter(),
        },
      });

      const {
        dateQualification: expectedDateQualification,
        accuséRéceptionDemandeComplèteRaccordement: { content: expectedContent },
        référenceDossierRaccordement: expectedRéférence,
      } = this.raccordementWorld;

      expect(actualDateQualification?.estÉgaleÀ(expectedDateQualification)).to.be.true;
      expect(actualRéférence.estÉgaleÀ(expectedRéférence)).to.be.true;

      if (actualAccuséRéception) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'CONSULTER_DOCUMENT_PROJET',
          data: {
            documentKey: actualAccuséRéception.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);
        actualContent.should.be.equal(expectedContent);
      }
    });
  },
);

Alors(
  'le projet lauréat {string} devrait avoir {int} dossiers de raccordement pour le gestionnaire de réseau {string}',
  async function (
    this: PotentielWorld,
    nomProjet: string,
    nombreDeDemandes: number,
    nomGestionnaireRéseau: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
        type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      actual.dossiers.should.length(nombreDeDemandes);
    });
  },
);
