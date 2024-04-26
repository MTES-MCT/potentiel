import { Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mediator } from 'mediateur';

Alors(
  `le gestionnaire de réseau {string} devrait être( disponible)( à jour) dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    // Assert read model
    const actualReadModel = await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
      type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
      data: {},
    });

    const expected = {
      items: [
        {
          aideSaisieRéférenceDossierRaccordement: {
            format: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.format,
            légende: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende,
            expressionReguliere:
              gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere,
          },
          identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
          raisonSociale: gestionnaireRéseau.raisonSociale,
        },
      ],
      total: 1,
      range: {
        startPosition: 0,
        endPosition: 1,
      },
    };

    ({
      items: actualReadModel.items.map((g) => ({
        aideSaisieRéférenceDossierRaccordement: {
          format: g.aideSaisieRéférenceDossierRaccordement.format,
          légende: g.aideSaisieRéférenceDossierRaccordement.légende,
          expressionReguliere:
            g.aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
        },
        identifiantGestionnaireRéseau: g.identifiantGestionnaireRéseau.codeEIC,
        raisonSociale: g.raisonSociale,
      })),
      total: actualReadModel.total,
      range: actualReadModel.range,
    }).should.deep.equal(expected);
  },
);

Alors(
  `les détails( à jour) du gestionnaire de réseau {string} devraient être consultables`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    // Assert read model
    const actualReadModel = await getConsulterReadModel(gestionnaireRéseau.codeEIC);

    const expected = {
      aideSaisieRéférenceDossierRaccordement: {
        format: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.format,
        légende: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende,
        expressionReguliere:
          gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere,
      },
      identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
      raisonSociale: gestionnaireRéseau.raisonSociale,
    };

    ({
      aideSaisieRéférenceDossierRaccordement: {
        format: actualReadModel.aideSaisieRéférenceDossierRaccordement.format,
        légende: actualReadModel.aideSaisieRéférenceDossierRaccordement.légende,
        expressionReguliere:
          actualReadModel.aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
      },
      identifiantGestionnaireRéseau: actualReadModel.identifiantGestionnaireRéseau.codeEIC,
      raisonSociale: actualReadModel.raisonSociale,
    }).should.be.deep.equal(expected);
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

const getConsulterReadModel = async (codeEIC: string) => {
  const actualReadModel = await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
    type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
    data: {
      identifiantGestionnaireRéseau: codeEIC,
    },
  });

  if (Option.isNone(actualReadModel)) {
    throw new Error(`Le read model gestionnaire de réseau n'existe pas !`);
  }

  return actualReadModel;
};
