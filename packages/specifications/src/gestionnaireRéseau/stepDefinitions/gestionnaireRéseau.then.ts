import { Then as Alors, defineParameterType } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  convertirEnIdentifiantGestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '@potentiel/domain-usecases';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { mediator } from 'mediateur';

Alors(
  `le gestionnaire de réseau {string} devrait être( disponible)( à jour) dans le référenciel des gestionnaires de réseau`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    // Assert aggregate
    const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
    actualAggregate.codeEIC.should.equal(gestionnaireRéseau.codeEIC);

    // Assert read model
    const actualReadModel = await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
      type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {
        pagination: {
          itemsPerPage: 1000,
          page: 1,
        },
      },
    });

    const expected = {
      currentPage: 1,
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
      itemsPerPage: 1000,
      totalItems: 1,
    };

    ({
      currentPage: actualReadModel.currentPage,
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
      itemsPerPage: actualReadModel.itemsPerPage,
      totalItems: 1,
    }).should.deep.equal(expected);
  },
);

Alors(
  `les détails( à jour) du gestionnaire de réseau {string} devraient être consultables`,
  async function (this: PotentielWorld, raisonSocialeGestionnaireRéseau: string) {
    const gestionnaireRéseau = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    // Assert aggregate
    const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
    actualAggregate.codeEIC.should.equal(gestionnaireRéseau.codeEIC);

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

defineParameterType({
  name: 'valide-invalide',
  regexp: /valide|invalide/,
  transformer: (s) => s as 'valide' | 'invalide',
});

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
    type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
    data: {
      identifiantGestionnaireRéseau: codeEIC,
    },
  });

  if (isNone(actualReadModel)) {
    throw new Error(`Le read model gestionnaire de réseau n'existe pas !`);
  }

  return actualReadModel;
};

const loadGestionnaireRéseauAggregate = async (codeEIC: string) => {
  const actualAggregate = await loadGestionnaireRéseauAggregateFactory({ loadAggregate })(
    convertirEnIdentifiantGestionnaireRéseau(codeEIC),
  );

  if (isNone(actualAggregate)) {
    throw new Error(`L'agrégat gestionnaire de réseau n'existe pas !`);
  }

  return actualAggregate;
};
