import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { Raccordement, GestionnaireRéseau } from '@potentiel-domain/reseau';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { convertReadableStreamToString } from '../../helpers/convertReadableToString';
import { PotentielWorld } from '../../potentiel.world';

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
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
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue:
              this.raccordementWorld.référenceDossierRaccordement.formatter(),
          },
        });

      expect(Option.isSome(dossierRaccordement)).to.be.true;

      if (Option.isSome(dossierRaccordement)) {
        const {
          référence: actualRéférence,
          demandeComplèteRaccordement: {
            accuséRéception: actualAccuséRéception,
            dateQualification: actualDateQualification,
          },
        } = dossierRaccordement;

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
      }
    });
  },
);

Alors(
  `le projet {string} devrait avoir un raccordement attribué au gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    // Assert on read model
    const résultat = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(résultat)) {
      throw new Error('Raccordement inconnu');
    }

    expect(
      résultat.identifiantGestionnaireRéseau?.estÉgaleÀ(
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
      ),
    ).to.be.true;
  },
);

Alors(
  `le projet {string} devrait avoir un raccordement attribué au gestionnaire de réseau inconnu`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    // Assert on read model
    const résultat = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(résultat)) {
      throw new Error('Raccordement inconnu');
    }

    expect(
      résultat.identifiantGestionnaireRéseau?.estÉgaleÀ(
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
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
    _raisonSociale: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

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
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat {string} ayant pour référence {string}`,
  async function (this: PotentielWorld, nomProjet: string, référenceDossierRaccordement: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
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
  `le dossier ayant pour référence {string} ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet {string}`,
  async function (this: PotentielWorld, référenceDossier: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
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
  `le dossier ayant comme référence {string} ne devrait plus être consultable dans le raccordement du projet lauréat {string}`,
  async function (this: PotentielWorld, référenceDossier: string, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
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
