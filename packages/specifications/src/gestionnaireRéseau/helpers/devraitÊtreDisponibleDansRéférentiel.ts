import { GestionnaireRéseauQuery, GestionnaireRéseauReadModel } from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world';
import { loadGestionnaireRéseauAggregate } from './loadGestionnaireRéseauAggregate';

export async function devraitÊtreDisponibleDansRéférentiel(
  this: GestionnaireRéseauWorld,
  raisonSociale: string,
) {
  const gestionnaireRéseau = this.rechercherGestionnaireRéseauFixture(raisonSociale);

  const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
  actualAggregate.codeEIC.should.equal(gestionnaireRéseau.codeEIC);

  const actual = await mediator.send<GestionnaireRéseauQuery>({
    type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
    data: {},
  });

  const expected: GestionnaireRéseauReadModel = {
    type: 'gestionnaire-réseau',
    ...gestionnaireRéseau,
  };

  actual.should.deep.contain(expected);
}
