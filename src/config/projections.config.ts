import {
  getGarantiesFinancièresProjector,
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
  GestionnairesRéseauListeProjector,
  GestionnaireRéseauDétailProjector,
  ProjectProjector,
} from '@infra/sequelize';
import { subscribeToRedis } from './eventBus.config';
import { eventStore } from './eventStore.config';

// This is legacy
initProjections();

// This is initProjections replacement
const projectors = initProjectors(eventStore);
console.log(`Initialized projectors: ${projectors.join(', ')}`);

const projectorsNext = [
  ProjectEventProjector,
  TâchesProjector,
  getGarantiesFinancièresProjector(),
  GestionnaireRéseauDétailProjector,
  GestionnairesRéseauListeProjector,
  ModificationRequestProjector,
  ProjectProjector,
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
