import { DomainEvent } from '../../core/domain';
import { DélaiAccordé, DélaiAccordéCorrigé } from '../../modules/demandeModification';
import { LegacyModificationImported } from '../../modules/modificationRequest';
import {
  handleLegacyModificationImported,
  handlePeriodeNotified,
  handleProjectCertificateObsolete,
  handleProjectRawDataImported,
  makeOnDélaiAccordé,
  makeOnDélaiAccordéCorrigé,
  PeriodeNotified,
  ProjectCertificateObsolete,
  ProjectRawDataImported,
  DateMiseEnServiceTransmise,
  makeOnCahierDesChargesChoisi,
  CahierDesChargesChoisi,
  makeOnDateMiseEnServiceTransmise,
  makeOnDemandeComplèteRaccordementTransmise,
  DemandeComplèteRaccordementTransmise,
} from '../../modules/project';
import { subscribeToRedis } from '../eventBus.config';
import { eventStore } from '../eventStore.config';
import {
  findProjectByIdentifiers,
  getUnnotifiedProjectsForPeriode,
  récupérerDétailDossiersRaccordements,
} from '../queries.config';
import { getProjectAppelOffre } from '../queryProjectAO.config';
import { projectRepo } from '../repos.config';
import { generateCertificate } from '../useCases.config';

eventStore.subscribe(
  PeriodeNotified.type,
  handlePeriodeNotified({
    projectRepo,
    generateCertificate,
    getUnnotifiedProjectsForPeriode,
    getProjectAppelOffre,
  }),
);

eventStore.subscribe(
  ProjectCertificateObsolete.type,
  handleProjectCertificateObsolete({
    generateCertificate,
  }),
);

eventStore.subscribe(
  ProjectRawDataImported.type,
  handleProjectRawDataImported({
    getProjectAppelOffre,
    findProjectByIdentifiers,
    projectRepo,
  }),
);

eventStore.subscribe(
  LegacyModificationImported.type,
  handleLegacyModificationImported({
    projectRepo,
    getProjectAppelOffre,
  }),
);

const onDélaiAccordéHandler = makeOnDélaiAccordé({
  projectRepo,
  publishToEventStore: eventStore.publish,
});

const onDélaiAccordé = async (event: DomainEvent) => {
  if (!(event instanceof DélaiAccordé)) {
    return Promise.resolve();
  }

  return onDélaiAccordéHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e),
  );
};
subscribeToRedis(onDélaiAccordé, 'Project.onDélaiAccordé');

const onDélaiAccordéCorrigéHandler = makeOnDélaiAccordéCorrigé({
  projectRepo,
  publishToEventStore: eventStore.publish,
});

const onDélaiAccordéCorrigé = async (event: DomainEvent) => {
  if (!(event instanceof DélaiAccordéCorrigé)) {
    return Promise.resolve();
  }

  return onDélaiAccordéCorrigéHandler(event).match(
    () => Promise.resolve(),
    (e) => Promise.reject(e),
  );
};
subscribeToRedis(onDélaiAccordéCorrigé, 'Project.onDélaiAccordéCorrigé');

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
