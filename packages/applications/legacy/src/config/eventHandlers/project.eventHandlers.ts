import {
  handleProjectRawDataCorrected,
  ProjectRawDataCorrected,
  ProjectRawDataImported,
  handleProjectRawDataImported,
} from '../../modules/project';
import { eventStore } from '../eventStore.config';
import { findProjectByIdentifiers } from '../queries.config';
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

console.log('Project Event Handlers Initialized');
export const projectHandlersOk = true;
