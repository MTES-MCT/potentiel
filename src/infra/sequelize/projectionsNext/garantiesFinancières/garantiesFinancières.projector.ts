import {
  DateEchéanceGFAjoutée,
  EtapeGFSupprimée,
  GarantiesFinancièresDataImported,
  GarantiesFinancièresInvalidées,
  GarantiesFinancièresValidées,
  ProjectAbandoned,
  ProjectClasseGranted,
  ProjectGFDueDateCancelled,
  ProjectGFDueDateSet,
  ProjectGFRemoved,
  ProjectGFSubmitted,
  ProjectGFUploaded,
  ProjectGFWithdrawn,
  ProjectNotified,
  ProjectReimported,
} from '@modules/project/events';
import { Projector, ProjectorFactory } from '../projector';
import { GarantiesFinancières } from './garantiesFinancières.model';
import { onDateEchéanceGFAjoutée } from './handlers/onDateEchéanceGFAjoutée';
import { onEtapeGFSupprimée } from './handlers/onEtapeGFSupprimée';
import { onGarantiesFinancièresInvalidées } from './handlers/onGarantiesFinancièresInvalidées';
import { onGarantiesFinancièresValidées } from './handlers/onGarantiesFinancièresValidées';
import { onProjectAbandoned } from './handlers/onProjectAbandoned';
import { onProjectClasseGranted } from './handlers/onProjectClasseGranted';
import { onProjectGFDueDateCancelled } from './handlers/onProjectGFDueDateCancelled';
import { onProjectGFDueDateSet } from './handlers/onProjectGFDueDateSet';
import { onProjectGFRemoved } from './handlers/onProjectGFRemoved';
import { onProjectGFSubmitted } from './handlers/onProjectGFSubmitted';
import { onProjectGFUploaded } from './handlers/onProjectGFUploaded';
import { onProjectGFWithdrawn } from './handlers/onProjectGFWithdrawn';
import { onProjectNotified } from './handlers/onProjectNotified';
import { onProjectReimported } from './handlers/onProjectReimported';
import { onGarantiesFinancièresDataImported } from './handlers/onGarantiesFinancièresDataImported';

let garantiesFinancièresProjector: Projector | null;

export const initializeGarantiesFinancièresProjector = (projectorFactory: ProjectorFactory) => {
  if (!garantiesFinancièresProjector) {
    garantiesFinancièresProjector = projectorFactory(GarantiesFinancières);
    initializeEventHandlers(garantiesFinancièresProjector);
  }

  return garantiesFinancièresProjector;
};

const initializeEventHandlers = (projector: Projector) => {
  projector.on(DateEchéanceGFAjoutée, onDateEchéanceGFAjoutée);
  projector.on(EtapeGFSupprimée, onEtapeGFSupprimée);
  projector.on(GarantiesFinancièresInvalidées, onGarantiesFinancièresInvalidées);
  projector.on(GarantiesFinancièresValidées, onGarantiesFinancièresValidées);
  projector.on(ProjectAbandoned, onProjectAbandoned);
  projector.on(ProjectClasseGranted, onProjectClasseGranted);
  projector.on(ProjectGFDueDateCancelled, onProjectGFDueDateCancelled);
  projector.on(ProjectGFDueDateSet, onProjectGFDueDateSet);
  projector.on(ProjectGFRemoved, onProjectGFRemoved);
  projector.on(ProjectGFSubmitted, onProjectGFSubmitted);
  projector.on(ProjectGFUploaded, onProjectGFUploaded);
  projector.on(ProjectGFWithdrawn, onProjectGFWithdrawn);
  projector.on(ProjectNotified, onProjectNotified);
  projector.on(ProjectReimported, onProjectReimported);
  projector.on(GarantiesFinancièresDataImported, onGarantiesFinancièresDataImported);
};
