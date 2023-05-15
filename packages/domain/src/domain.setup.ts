import { Ports } from './domain.ports';
import { setupGestionnaireRéseau } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjet } from './projet/projet.setup';
import { setupRaccordement } from './raccordement/raccordement.setup';

export const setupDomain = async (ports: Ports) => {
  setupGestionnaireRéseau(ports);
  setupProjet(ports);
  setupRaccordement(ports);
};
