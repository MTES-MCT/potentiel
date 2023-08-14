import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../core/domain';
import { UnwrapForTest } from '../../core/utils';
import { appelsOffreStatic } from '../../dataAccess/inMemory';
import { makeUser } from '../../entities';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeProject from '../../__tests__/fixtures/project';
import makeFakeUser from '../../__tests__/fixtures/user';
import { makeGetProjectAppelOffre } from "../projectAppelOffre";
import { EliminatedProjectCannotBeAbandonnedError } from './errors';
import { LegacyProjectSourced, ProjectAbandoned } from './events';
import { makeProject } from './Project';

const projectId = new UniqueEntityID('project1');
const appelOffreId = 'Fessenheim';
const periodeId = '2';
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
const { familleId, numeroCRE } = fakeProject;

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);

describe('Project.abandon()', () => {
  describe('when project is Classé', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, classe: 'Classé' },
              potentielIdentifier: '',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      }),
    );

    it('should emit ProjectAbandoned event', () => {
      project.abandon(fakeUser);

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectAbandoned.type,
      ) as ProjectAbandoned | undefined;
      expect(targetEvent).toBeDefined();
      if (!targetEvent) return;

      expect(targetEvent.payload.projectId).toEqual(projectId.toString());
      expect(targetEvent.payload.abandonAcceptedBy).toEqual(fakeUser.id);
    });
  });

  describe('when project is Eliminé', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, classe: 'Eliminé' },
              potentielIdentifier: '',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      }),
    );

    it('should return EliminatedProjectCannotBeAbandonnedError', () => {
      const res = project.abandon(fakeUser);

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EliminatedProjectCannotBeAbandonnedError);

      expect(project.pendingEvents.length).toEqual(0);
    });
  });
});
