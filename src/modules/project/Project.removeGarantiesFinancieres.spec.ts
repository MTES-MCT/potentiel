import { describe, expect, it } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '@core/domain';
import { UnwrapForTest } from '@core/utils';
import { appelsOffreStatic } from '@dataAccess/inMemory';
import {
  GarantiesFinancièresValidées,
  ProjectGFRemoved,
  ProjectGFSubmitted,
  ProjectImported,
  ProjectNotified,
} from './events';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre';
import {
  NoGFCertificateToDeleteError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  SuppressionGFATraiterImpossibleError,
  SuppressionGFValidéeImpossibleError,
} from './errors';
import makeFakeProject from '../../__tests__/fixtures/project';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeUser from '../../__tests__/fixtures/user';
import { makeUser } from '@entities';
import { USER_ROLES } from '@modules/users';

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);
const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));

describe('Project.removeGarantiesFinancieres()', () => {
  describe('when the project has not been notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const projectId = new UniqueEntityID();
      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
          history: [
            new ProjectGFRemoved({
              payload: {
                projectId: projectId.toString(),
                removedBy: 'user-id',
              },
              original: {
                occurredAt: new Date(123),
                version: 1,
              },
            }),
          ],
          buildProjectIdentifier: () => '',
        }),
      );

      const res = project.removeGarantiesFinancieres(fakeUser);

      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError);
    });
  });
  describe('when the project has been notified', () => {
    describe('when project GF has to be submitted on Potentiel after application to AO (CRE4)', () => {
      const projectId = new UniqueEntityID();
      const appelOffreId = 'Fessenheim';
      const periodeId = '2';
      const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
      const { familleId, numeroCRE, potentielIdentifier } = fakeProject;

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
      describe('when project does not have a GF certificate', () => {
        it('should return a NoGFCertificateToDeleteError', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFRemoved({
                  payload: {
                    projectId: projectId.toString(),
                    removedBy: 'user-id',
                  },
                  original: {
                    occurredAt: new Date(123),
                    version: 1,
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            }),
          );
          const res = project.removeGarantiesFinancieres(fakeUser);
          expect(res.isErr()).toEqual(true);
          if (res.isOk()) return;
          expect(res.error).toBeInstanceOf(NoGFCertificateToDeleteError);
        });
      });
      describe(`when the GF are validated`, () => {
        it(`if the user is porteur 
            it should return a SuppressionGFValidéeImpossibleError'`, () => {
          const porteur = OldUnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFSubmitted({
                  payload: {
                    projectId: projectId.toString(),
                    submittedBy: 'user-id',
                    fileId: 'id',
                    gfDate: new Date('2022-01-01'),
                  },
                  original: {
                    occurredAt: new Date(123),
                    version: 1,
                  },
                }),
                new GarantiesFinancièresValidées({
                  payload: {
                    projetId: projectId.toString(),
                    validéesPar: 'user-id-2',
                  },
                  original: {
                    occurredAt: new Date(123),
                    version: 1,
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            }),
          );
          const res = project.removeGarantiesFinancieres(porteur);
          expect(res.isErr()).toEqual(true);
          if (res.isOk()) return;
          expect(res.error).toBeInstanceOf(SuppressionGFValidéeImpossibleError);
        });
      });
      describe(`when the GF are not validated`, () => {
        for (const role of USER_ROLES.filter((role) =>
          ['admin', 'dreal', 'dgec-validateur', 'cre'].includes(role),
        )) {
          it(`if user is ${role} 
              it should return a SuppressionGFATraiterImpossibleError`, () => {
            const user = OldUnwrapForTest(makeUser(makeFakeUser({ role })));
            const project = UnwrapForTest(
              makeProject({
                projectId,
                history: [
                  ...fakeHistory,
                  new ProjectGFSubmitted({
                    payload: {
                      projectId: projectId.toString(),
                      submittedBy: 'user-id',
                      fileId: 'id',
                      gfDate: new Date('2022-01-01'),
                    },
                    original: {
                      occurredAt: new Date(123),
                      version: 1,
                    },
                  }),
                ],
                getProjectAppelOffre,
                buildProjectIdentifier: () => '',
              }),
            );
            const res = project.removeGarantiesFinancieres(user);
            expect(res.isErr()).toEqual(true);
            if (res.isOk()) return;
            expect(res.error).toBeInstanceOf(SuppressionGFATraiterImpossibleError);
          });
        }
      });
      describe('when a GF has been submitted on Potentiel', () => {
        it('should emit a ProjectGFRemoved event', () => {
          const porteur = OldUnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFSubmitted({
                  payload: {
                    projectId: projectId.toString(),
                    submittedBy: 'user-id',
                    fileId: 'id',
                    gfDate: new Date('2022-01-01'),
                  },
                  original: {
                    occurredAt: new Date(123),
                    version: 1,
                  },
                }),
              ],
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            }),
          );
          project.removeGarantiesFinancieres(porteur);

          expect(project.pendingEvents).toHaveLength(1);

          const targetEvent = project.pendingEvents[0];
          if (!targetEvent) return;

          expect(targetEvent.type).toEqual(ProjectGFRemoved.type);
          expect(targetEvent.payload.projectId).toEqual(projectId.toString());
          expect(targetEvent.payload.removedBy).toEqual(porteur.id);
        });
      });
    });
  });
});
