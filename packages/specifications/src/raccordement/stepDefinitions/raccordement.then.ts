import { Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { mediator } from 'mediateur';
import { Raccordement , GestionnaireRéseau } from '@potentiel-domain/reseau';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';
import { isNone } from '@potentiel/monads';
import { DateTime } from '@potentiel-domain/common';

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
  `le projet {string} devrait avoir comme gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    // Assert on read model
    const résultat = await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    expect(
      résultat.identifiantGestionnaireRéseau.estÉgaleÀ(
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
      ),
    ).to.be.true;
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

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement du le projet lauréat {string} ayant pour référence {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    nomProjet: string,
    référenceDossierRaccordement: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
        data: {
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (isNone(actual)) {
        throw new Error('Dossier de raccordement non trouvé');
      }

      if (isNone(actual.miseEnService)) {
        throw new Error('Date mise en service non trouvé');
      }

      expect(
        actual.miseEnService?.dateMiseEnService?.estÉgaleÀ(
          DateTime.convertirEnValueType(new Date(dateMiseEnService).toISOString()),
        ),
      ).to.be.true;
    });
  },
);

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat {string} ayant pour référence {string}`,
  async function (this: PotentielWorld, nomProjet: string, référenceDossierRaccordement: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      const { propositionTechniqueEtFinancière } =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossierRaccordement,
          },
        });

      const {
        dateSignature: expectedDateSignature,
        propositionTechniqueEtFinancièreSignée: { content: expectedContent },
      } = this.raccordementWorld;

      expect(propositionTechniqueEtFinancière).to.be.not.undefined;

      expect(propositionTechniqueEtFinancière?.dateSignature?.estÉgaleÀ(expectedDateSignature)).to
        .be.true;

      if (propositionTechniqueEtFinancière) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'CONSULTER_DOCUMENT_PROJET',
          data: {
            documentKey:
              propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.formatter(),
          },
        });

        const actualContent = await convertReadableStreamToString(result.content);
        actualContent.should.be.equal(expectedContent);
      }
    });
  },
);
