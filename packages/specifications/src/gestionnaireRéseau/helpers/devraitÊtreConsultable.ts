import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
} from '@potentiel/domain-views';
import { mediator } from 'mediateur';
import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world';
import { loadGestionnaireRéseauAggregate } from './loadGestionnaireRéseauAggregate';

export async function devraitÊtreConsultable(this: GestionnaireRéseauWorld, raisonSociale: string) {
  const gestionnaireRéseau = this.rechercherGestionnaireRéseauFixture(raisonSociale);

  const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
  actualAggregate.codeEIC.should.equal(gestionnaireRéseau.codeEIC);

  const actual = await mediator.send<ConsulterGestionnaireRéseauQuery>({
    type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
    data: {
      identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
    },
  });

  const expected: GestionnaireRéseauReadModel = {
    type: 'gestionnaire-réseau',
    ...gestionnaireRéseau,
  };

  actual.should.be.deep.equal(expected);
}
