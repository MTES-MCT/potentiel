import { expect } from 'chai';
import { convertirEnRéférenceDossierRaccordement } from '@potentiel/domain';
import { ConsulterGestionnaireRéseauQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';
import { mediator } from 'mediateur';
import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world';
import { loadGestionnaireRéseauAggregate } from './loadGestionnaireRéseauAggregate';

export async function devraitÊtreUnRéférenceValideOuInvalide(
  this: GestionnaireRéseauWorld,
  raisonSociale: string,
  référenceÀValider: string,
  expected: 'valide' | 'invalide',
) {
  const gestionnaireRéseau = this.rechercherGestionnaireRéseauFixture(raisonSociale);

  const actualAggregate = await loadGestionnaireRéseauAggregate(gestionnaireRéseau.codeEIC);
  const actual = actualAggregate.validerRéférenceDossierRaccordement(
    convertirEnRéférenceDossierRaccordement(référenceÀValider),
  );
  actual.should.equal(expected === 'valide' ? true : false);

  const actualReadModel = await mediator.send<ConsulterGestionnaireRéseauQuery>({
    type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
    data: {
      identifiantGestionnaireRéseau: gestionnaireRéseau.codeEIC,
    },
  });

  if (isNone(actualReadModel)) {
    throw new Error(`Le read model gestionnaire de réseau n'existe pas !`);
  }
  expect(actualReadModel.aideSaisieRéférenceDossierRaccordement.expressionReguliere).not.to.be
    .undefined;

  expect(
    new RegExp(actualReadModel.aideSaisieRéférenceDossierRaccordement?.expressionReguliere!).test(
      référenceÀValider,
    ),
  ).to.equal(expected === 'valide' ? true : false);
}
