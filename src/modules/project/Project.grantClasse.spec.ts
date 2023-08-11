import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { UnwrapForTest } from '@core/utils';
import { appelsOffreStatic } from '@dataAccess/inMemory';
import { makeUser } from '@entities';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeProject from '../../__tests__/fixtures/project';
import makeFakeUser from '../../__tests__/fixtures/user';
import { LegacyProjectSourced, ProjectClasseGranted } from './events';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre';
import { ProjetDéjàClasséError } from '@modules/modificationRequest';

const projectId = new UniqueEntityID('project1');
const appelOffreId = 'Fessenheim';
const periodeId = '2';
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
const { familleId, numeroCRE } = fakeProject;

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);

describe('Project.grantClasse()', () => {
  describe('Si le projet est Eliminé', () => {
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

    it('Alors un événement ProjectClasseGranted devrait être émis.', () => {
      project.grantClasse(fakeUser);

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectClasseGranted.type,
      ) as ProjectClasseGranted | undefined;
      expect(targetEvent).toBeDefined();
      if (!targetEvent) return;

      expect(targetEvent.payload.projectId).toEqual(projectId.toString());
      expect(targetEvent.payload.grantedBy).toEqual(fakeUser.id);
    });
  });

  describe('Si le projet est Classé', () => {
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

    it('Alors aucun événement ne devrait être émis et une erreur devrait être retournée', () => {
      const résultat = project.grantClasse(fakeUser);

      expect(project.pendingEvents).toHaveLength(0);

      expect(résultat.isErr()).toBe(true);
      if (!résultat.isErr()) return;
      expect(résultat.error).toBeInstanceOf(ProjetDéjàClasséError);
    });
  });
});
