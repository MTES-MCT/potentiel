import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { Raccordement, GestionnaireRéseau } from '@potentiel-domain/reseau';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { convertReadableStreamToString } from '../../helpers/convertReadableToString';
import { PotentielWorld } from '../../potentiel.world';
import { waitForEvents } from '../../helpers/waitForEvents';

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Raccordement inconnu');
      }

      actual.dossiers
        .map((d) => d.référence.formatter())
        .should.contain(this.raccordementWorld.référenceDossierRaccordement.formatter());
    });
  },
);

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue:
              this.raccordementWorld.référenceDossierRaccordement.formatter(),
          },
        });

      assert(Option.isSome(raccordement), 'raccordement non trouvé');
      assert(Option.isSome(dossierRaccordement), 'dossier raccordement non trouvé');

      const {
        référence: actualRéférence,
        demandeComplèteRaccordement: {
          accuséRéception: actualAccuséRéception,
          dateQualification: actualDateQualification,
        },
        identifiantGestionnaireRéseau,
      } = dossierRaccordement;

      expect(identifiantGestionnaireRéseau.codeEIC).to.eq(
        raccordement.identifiantGestionnaireRéseau?.codeEIC,
        'Gestionnaire réseau incorrect',
      );

      const {
        dateQualification: expectedDateQualification,
        accuséRéceptionDemandeComplèteRaccordement: { content: expectedContent },
        référenceDossierRaccordement: expectedRéférence,
      } = this.raccordementWorld;

      expect(actualDateQualification?.estÉgaleÀ(expectedDateQualification)).to.be.true;
      expect(actualRéférence.estÉgaleÀ(expectedRéférence)).to.be.true;

      if (actualAccuséRéception) {
        const result = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
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
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld;
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    );
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

    const { commune, codePostal } = this.candidatureWorld.importerCandidature.values.localitéValue;
    const codeEIC =
      this.gestionnaireRéseauWorld.rechercherOREParVille({ commune, codePostal })?.codeEIC ?? '';

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    );
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    );
  },
);

Alors(
  'le projet lauréat devrait avoir {int} dossiers de raccordement pour le gestionnaire de réseau {string}',
  async function (this: PotentielWorld, nombreDeDemandes: number, _raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Raccordement inconnu');
      }

      actual.dossiers.should.length(nombreDeDemandes);
    });
  },
);

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement du projet lauréat ayant pour référence {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    référenceDossierRaccordement: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForEvents();
    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Dossier de raccordement non trouvé');
      }

      if (Option.isNone(actual.miseEnService)) {
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
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat ayant pour référence {string}`,
  async function (this: PotentielWorld, référenceDossierRaccordement: string) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossierRaccordement,
          },
        });

      expect(Option.isSome(dossierRaccordement)).to.be.true;

      if (Option.isSome(dossierRaccordement)) {
        const { propositionTechniqueEtFinancière } = dossierRaccordement;

        const {
          dateSignature: expectedDateSignature,
          propositionTechniqueEtFinancièreSignée: { content: expectedContent },
        } = this.raccordementWorld;

        expect(propositionTechniqueEtFinancière).to.be.not.undefined;

        expect(propositionTechniqueEtFinancière?.dateSignature?.estÉgaleÀ(expectedDateSignature)).to
          .be.true;

        if (propositionTechniqueEtFinancière) {
          const result = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey:
                propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.formatter(),
            },
          });

          const actualContent = await convertReadableStreamToString(result.content);
          actualContent.should.be.equal(expectedContent);
        }
      }
    });
  },
);

Alors(
  `le dossier ayant pour référence {string} ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet`,
  async function (this: PotentielWorld, référenceDossier: string) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const raccordementDuProjet = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(raccordementDuProjet)) {
        throw new Error('Raccordement inconnu');
      }

      const dossierCible = raccordementDuProjet.dossiers.find(
        (d) => d.référence.formatter() === référenceDossier,
      );

      expect(dossierCible).to.be.undefined;

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      expect(Option.isNone(dossierRaccordement)).to.be.true;
    });
  },
);

Alors(
  `le dossier ayant comme référence {string} ne devrait plus être consultable dans le raccordement du projet lauréat`,
  async function (this: PotentielWorld, référenceDossier: string) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      expect(Option.isNone(raccordement)).to.be.true;

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      expect(Option.isNone(dossierRaccordement)).to.be.true;
    });
  },
);

async function vérifierGestionnaireAttribué(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
) {
  await waitForExpect(async () => {
    // Assert on read model
    const résultat = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    assert(Option.isSome(résultat));

    expect(résultat.identifiantGestionnaireRéseau?.codeEIC).to.eq(
      identifiantGestionnaireRéseau?.codeEIC,
      'raccordement invalide',
    );

    for (const { référence } of résultat.dossiers) {
      const dossier = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: référence.formatter(),
        },
      });
      assert(Option.isSome(dossier));
      expect(dossier.identifiantGestionnaireRéseau.codeEIC).to.eq(
        identifiantGestionnaireRéseau.codeEIC,
        'dossier invalide',
      );
    }
  });
}
