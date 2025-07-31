import { DomainEvent } from '../../core/domain';
import { DélaiAccordé, DélaiAccordéCorrigé } from '../../modules/demandeModification';
import { LegacyModificationImported } from '../../modules/modificationRequest';
import {
  handleLegacyModificationImported,
  handleProjectRawDataCorrected,
  DateMiseEnServiceTransmise,
  makeOnCahierDesChargesChoisi,
  CahierDesChargesChoisi,
  makeOnDateMiseEnServiceTransmise,
  makeOnDemandeComplèteRaccordementTransmise,
  DemandeComplèteRaccordementTransmise,
  ProjectRawDataCorrected,
  ProjectRawDataImported,
  handleProjectRawDataImported,
} from '../../modules/project';
import { subscribeToRedis } from '../eventBus.config';
import { eventStore } from '../eventStore.config';
import { findProjectByIdentifiers, récupérerDétailDossiersRaccordements } from '../queries.config';
import { getProjectAppelOffre } from '../queryProjectAO.config';
import { projectRepo } from '../repos.config';
import { getUserById } from '../queries.config';

eventStore.subscribe(
  ProjectRawDataImported.type,
  handleProjectRawDataImported({
    getProjectAppelOffre,
    findProjectByIdentifiers,
    projectRepo,
  }),
);

eventStore.subscribe(
  ProjectRawDataCorrected.type,
  handleProjectRawDataCorrected({
    projectRepo,
    getUserById,
  }),
);

eventStore.subscribe(
  LegacyModificationImported.type,
  handleLegacyModificationImported({
    projectRepo,
    getProjectAppelOffre,
  }),
);

const onCahierDesChargesChoisiHandler = makeOnCahierDesChargesChoisi({
  projectRepo,
  publishToEventStore: eventStore.publish,
  getProjectAppelOffre,
  récupérerDétailDossiersRaccordements,
});

const onCahierDesChargesChoisi = async (event: DomainEvent) => {
  if (!(event instanceof CahierDesChargesChoisi)) {
    return Promise.resolve();
  }

  return onCahierDesChargesChoisiHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e),
  );
};

subscribeToRedis(onCahierDesChargesChoisi, 'Project.onCahierDesChargesChoisi');

const onDateMiseEnServiceTransmiseHandler = makeOnDateMiseEnServiceTransmise({
  projectRepo,
  publishToEventStore: eventStore.publish,
  getProjectAppelOffre,
  findProjectByIdentifiers,
  récupérerDétailDossiersRaccordements,
});

const onDateMiseEnServiceTransmise = async (event: DomainEvent) => {
  if (!(event instanceof DateMiseEnServiceTransmise)) {
    return Promise.resolve();
  }

  return onDateMiseEnServiceTransmiseHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e),
  );
};

subscribeToRedis(onDateMiseEnServiceTransmise, 'Project.onDateMiseEnServiceTransmise');

const onDemandeComplèteRaccordementTransmiseHandler = makeOnDemandeComplèteRaccordementTransmise({
  projectRepo,
  publishToEventStore: eventStore.publish,
  getProjectAppelOffre,
  findProjectByIdentifiers,
});

const onDemandeComplèteRaccordementTransmise = async (event: DomainEvent) => {
  if (!(event instanceof DemandeComplèteRaccordementTransmise)) {
    return Promise.resolve();
  }

  return onDemandeComplèteRaccordementTransmiseHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e),
  );
};

subscribeToRedis(
  onDemandeComplèteRaccordementTransmise,
  'Project.onDemandeComplèteRaccordementTransmise',
);

console.log('Project Event Handlers Initialized');
export const projectHandlersOk = true;
