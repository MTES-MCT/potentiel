import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { setupGestionnaireRéseau } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjet } from './projet/projet.setup';
import { RaccordementDependencies, setupRaccordement } from './raccordement/raccordement.setup';

export type DomainDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  raccordement: Omit<RaccordementDependencies, keyof DomainDependencies['common']>;
};

export const setupDomain = ({ common, raccordement }: DomainDependencies) => {
  setupGestionnaireRéseau(common);
  setupProjet(common);
  setupRaccordement({
    ...common,
    ...raccordement,
  });
};
