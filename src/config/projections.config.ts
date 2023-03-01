import {
  GarantiesFinancièresProjector,
  RaccordementsProjector,
  initProjections,
  initProjectors,
  ProjectEventProjector,
  TâchesProjector,
  UserProjector,
  UserProjectsProjector,
  UserProjectClaimsProjector,
  UserDrealProjector,
  ModificationRequestProjector,
} from '@infra/sequelize';
import { GestionnaireRéseauDétailProjector } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/détail/gestionnairesRéseauDétail.model';
import { GestionnairesRéseauListeProjector } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/liste/gestionnairesRéseauListe.model';
import { subscribeToRedis } from './eventBus.config';
import { eventStore } from './eventStore.config';

// This is legacy
initProjections(eventStore);

// This is initProjections replacement
const projectors = initProjectors(eventStore);
console.log(`Initialized projectors: ${projectors.join(', ')}`);

const projectorsNext = [
  ProjectEventProjector,
  TâchesProjector,
  GarantiesFinancièresProjector,
  GestionnaireRéseauDétailProjector,
  GestionnairesRéseauListeProjector,
  ModificationRequestProjector,
  RaccordementsProjector,
  UserProjector,
  UserProjectsProjector,
  UserProjectClaimsProjector,
  UserDrealProjector,
].map((projector) => {
  projector.initEventStream({
    subscribe: subscribeToRedis,
  });
  return projector.name;
});

console.log(`Initialized nextgen projectors: ${projectorsNext.join(', ')}`);

console.log('Projections initialized');
