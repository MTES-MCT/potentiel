import {
  getGarantiesFinancièresProjector,
  RaccordementsProjector,
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
