import { Ports } from './domain.ports';
import { setupGestionnaireRéseau } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjet } from './projet/projet.setup';
import { setupRaccordement } from './raccordement/raccordement.setup';

export type UnsetupDomain = () => Promise<void>;

export const setupDomain = (ports: Ports): UnsetupDomain => {
  const unsubscribes = [
    ...setupGestionnaireRéseau(ports),
    ...setupProjet(ports),
    ...setupRaccordement(ports),
  ];
  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
