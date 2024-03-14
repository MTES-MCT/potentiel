import { describe, expect, it } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '../../core/domain';
import { UnwrapForTest } from '../../core/utils';
import { appelsOffreStatic } from '../../dataAccess/inMemory';
import { ProjectGFUploaded, ProjectGFWithdrawn, ProjectImported, ProjectNotified } from './events';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '../projectAppelOffre';
import {
  NoGFCertificateToDeleteError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
  SuppressionGFValidéeImpossibleError,
} from './errors';
import makeFakeProject from '../../__tests__/fixtures/project';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeUser from '../../__tests__/fixtures/user';
import { makeUser } from '../../entities';

const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);
const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));

describe('Project.withdrawGarantiesFinancieres()', () => {
  describe('when project has not been notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const projectId = new UniqueEntityID();
      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
          history: [
            new ProjectGFWithdrawn({
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

      const res = project.withdrawGarantiesFinancieres(fakeUser);

      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError);
    });
  });
  describe('when the project has been notified', () => {
    describe('when project GF has to be submitted when applying to AO but can be uploaded later on Potentiel (PPE2)', () => {
      const projectId = new UniqueEntityID();
      const appelOffreId = 'PPE2 - Sol';
      const periodeId = '1';
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
      describe('when project does not have a GF', () => {
        it('should return a NoGFCertificateToDeleteError', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFWithdrawn({
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
          const res = project.withdrawGarantiesFinancieres(fakeUser);
          expect(res.isErr()).toEqual(true);
          if (res.isOk()) return;
          expect(res.error).toBeInstanceOf(NoGFCertificateToDeleteError);
        });
      });

      describe(`when user is 'porteur-projet' and the GF is uploaded (and validated)`, () => {
        it('should return a SuppressionGFValidéeImpossibleError', () => {
          const porteur = OldUnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFUploaded({
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
          const res = project.removeGarantiesFinancieres(porteur);
          expect(res.isErr()).toEqual(true);
          if (res.isOk()) return;
          expect(res.error).toBeInstanceOf(SuppressionGFValidéeImpossibleError);
        });
      });

      describe('when the GF certificate has been uploaded on Potentiel', () => {
        it('should emit a ProjectGFWithdrawn event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFUploaded({
                  payload: {
                    projectId: projectId.toString(),
                    submittedBy: 'user-id',
                    gfDate: new Date('2022-01-01'),
                    fileId: 'id',
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

          project.withdrawGarantiesFinancieres(fakeUser);

          expect(project.pendingEvents).toHaveLength(1);

          const targetEvent = project.pendingEvents[0];
          if (!targetEvent) return;

          expect(targetEvent.type).toEqual(ProjectGFWithdrawn.type);
          expect(targetEvent.payload.projectId).toEqual(projectId.toString());
          expect(targetEvent.payload.removedBy).toEqual(fakeUser.id);
        });
      });
    });
  });
});
