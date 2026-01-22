import { expect } from 'chai';
import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { PlainType, mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { ExpressionRegulière } from '@potentiel-domain/common';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';

Alors(
  `le gestionnaire de réseau {string} devrait être( disponible)( à jour) dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await waitForExpect(async () => {
      const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
        raisonSocialeGestionnaireRéseau,
      );

      // Assert read model
      const listerGestionnaireRéseauReadModel =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
          data: {},
        });

      const actual = mapToPlainObject(listerGestionnaireRéseauReadModel);
      actual.items[0];

      const expected: PlainType<GestionnaireRéseau.ListerGestionnaireRéseauReadModel> = {
        items: [
          {
            aideSaisieRéférenceDossierRaccordement: {
              format: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement?.format || '',
              légende: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende || '',

              expressionReguliere: {
                expression:
                  gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere ||
                  ExpressionRegulière.accepteTout.formatter(),
              },
            },
            identifiantGestionnaireRéseau: {
              codeEIC: gestionnaireRéseau.codeEIC,
            },
            raisonSociale: gestionnaireRéseau.raisonSociale,
            contactEmail: gestionnaireRéseau.contactEmail
              ? {
                  email: gestionnaireRéseau.contactEmail,
                }
              : Option.none,
          },
        ],
        total: 1,
        range: {
          startPosition: 0,
          endPosition: 1,
        },
      };

      expect(actual).to.be.deep.equal(expected);
    });
  },
);

Alors(
  `les détails( à jour) du gestionnaire de réseau {string} devraient être consultables`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    await waitForExpect(async () => {
      const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
        raisonSocialeGestionnaireRéseau,
      );

      // Assert read model
      const consulterGestionnaireRéseauReadModel =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
          },
        });

      const actual = mapToPlainObject(consulterGestionnaireRéseauReadModel);

      const expected: PlainType<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel> = {
        aideSaisieRéférenceDossierRaccordement: {
          format: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.format || '',
          légende: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende || '',
          expressionReguliere: {
            expression:
              gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere ||
              ExpressionRegulière.accepteTout.formatter(),
          },
        },
        identifiantGestionnaireRéseau: {
          codeEIC: gestionnaireRéseau.codeEIC,
        },
        contactEmail: gestionnaireRéseau.contactEmail
          ? {
              email: gestionnaireRéseau.contactEmail,
            }
          : Option.none,
        raisonSociale: gestionnaireRéseau.raisonSociale,
      };

      expect(actual).to.be.deep.equal(expected);
    });
  },
);

Alors(
  `la référence de dossier {string} devrait être {valide-invalide}`,
  async function (
    this: PotentielWorld,
    référenceÀValider: string,
    résultat: 'valide' | 'invalide',
  ) {
    const actual = this.gestionnaireRéseauWorld.résultatsValidation.get(référenceÀValider);

    if (actual === undefined) {
      throw new Error(
        `Aucun résultat de validation disponible pour la référence ${référenceÀValider}`,
      );
    }

    actual.should.equal(résultat === 'valide' ? true : false);
  },
);
