import { beforeAll, describe, expect, it } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '../../core/domain';
import { logger, UnwrapForTest } from '../../core/utils';
import { appelsOffreStatic } from '../../dataAccess/inMemory';
import { makeUser } from '../../entities';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeProject from '../../__tests__/fixtures/project';
import makeFakeUser from '../../__tests__/fixtures/user';
import { IllegalProjectStateError, ProjectCannotBeUpdatedIfUnnotifiedError } from './errors';
import {
  LegacyProjectSourced,
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectNotified,
} from './events';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '../projectAppelOffre';
import { add, sub } from 'date-fns';

const projectId = new UniqueEntityID('project1');
const appelOffreId = 'Fessenheim';
const periodeId = '2';
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
const { familleId, numeroCRE, potentielIdentifier } = fakeProject;

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);

const makeFakeHistory = (fakeProject: any): DomainEvent[] => {
  return [
    new LegacyProjectSourced({
      payload: {
        projectId: projectId.toString(),
        periodeId: fakeProject.periodeId,
        appelOffreId: fakeProject.appelOffreId,
        familleId: fakeProject.familleId,
        numeroCRE: fakeProject.numeroCRE,
        content: fakeProject,
        potentielIdentifier: '',
      },
    }),
  ];
};

const fakeHistory: DomainEvent[] = [
  new ProjectImported({
    payload: {
      projectId: projectId.toString(),
      periodeId,
      appelOffreId,
      familleId,
      numeroCRE,
      importId: '',
      data: fakeProject,
      potentielIdentifier,
    },
    original: {
      occurredAt: new Date(123),
      version: 1,
    },
  }),
  new ProjectNotified({
    payload: {
      projectId: projectId.toString(),
      periodeId,
      appelOffreId,
      familleId,
      candidateEmail: 'test@test.com',
      candidateName: '',
      notifiedOn: 123,
    },
    original: {
      occurredAt: new Date(456),
      version: 1,
    },
  }),
];
