import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../core/domain';
import { UnwrapForTest } from '../../core/utils';
import { appelsOffreStatic } from '../../dataAccess/inMemory';
import { makeUser } from '../../entities';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeProject from '../../__tests__/fixtures/project';
import makeFakeUser from '../../__tests__/fixtures/user';
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors';
import { LegacyProjectSourced, ProjectProducteurUpdated } from './events';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '../projectAppelOffre';

const projectId = new UniqueEntityID('project1');
const appelOffreId = 'Fessenheim';
const periodeId = '2';
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
const { familleId, numeroCRE } = fakeProject;

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);

const newProducteur = 'newProducteur';

describe('Project.updateProducteur()', () => {
  describe('when project has been notified', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              potentielIdentifier: '',
              appelOffreId: 'Fessenheim',
              periodeId: '3',
              familleId: '3', // <-- no GF
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 123 },
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      }),
    );

    it('should emit a ProjectProducteurUpdated event', () => {
      project.updateProducteur(fakeUser, newProducteur);

      expect(project.pendingEvents).toHaveLength(1);

      const targetEvent = project.pendingEvents[0];
      if (!targetEvent) return;

      expect(targetEvent.type).toEqual(ProjectProducteurUpdated.type);
      expect(targetEvent.payload.projectId).toEqual(projectId.toString());
      expect(targetEvent.payload.updatedBy).toEqual(fakeUser.id);
      expect(targetEvent.payload.newProducteur).toEqual(newProducteur);
    });
  });

  describe('when project has not been notified', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              potentielIdentifier: '',
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 0 },
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      }),
    );

    it('should return ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const res = project.updateProducteur(fakeUser, newProducteur);
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError);
      expect(project.pendingEvents.length).toEqual(0);
    });
  });
});
