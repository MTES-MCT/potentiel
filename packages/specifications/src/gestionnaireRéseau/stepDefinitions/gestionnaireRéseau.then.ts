import { Then as Alors, defineParameterType } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  convertirEnIdentifiantGestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
  ListerGestionnaireRéseauQuery,
} from '@potentiel/domain-views';
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
    const actualReadModel = await mediator.send<ListerGestionnaireRéseauQuery>({
      type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
      data: {},
    });

    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      ...gestionnaireRéseau,
    };

    actualReadModel.items.should.deep.contain(expected);
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

    const expected: GestionnaireRéseauReadModel = {
      type: 'gestionnaire-réseau',
      ...gestionnaireRéseau,
    };

    actualReadModel.should.be.deep.equal(expected);
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
  const actualReadModel = await mediator.send<ConsulterGestionnaireRéseauQuery>({
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
