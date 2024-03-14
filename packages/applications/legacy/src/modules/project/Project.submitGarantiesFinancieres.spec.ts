import { describe, expect, it } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '../../core/domain';
import { UnwrapForTest } from '../../core/utils';
import { appelsOffreStatic } from '../../dataAccess/inMemory';
import makeFakeProject from '../../__tests__/fixtures/project';
import {
  ProjectAbandoned,
  ProjectGFSubmitted,
  ProjectImported,
  ProjectNotified,
  TypeGarantiesFinancièresEtDateEchéanceTransmis,
} from './events';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '../projectAppelOffre';
import {
  GFCertificateHasAlreadyBeenSentError,
  GFImpossibleASoumettreError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from './errors';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeUser from '../../__tests__/fixtures/user';
import { makeUser } from '../../entities';

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);
const projectId = new UniqueEntityID();

describe('Project.submitGarantiesFinancieres()', () => {
  describe('when the project has not been notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
          history: [
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
          buildProjectIdentifier: () => '',
        }),
      );
      const res = project.submitGarantiesFinancieres({
        gfDate: new Date('2022-01-01'),
        fileId: 'fileId',
        submittedBy: fakeUser,
        dateEchéance: new Date('2025-01-01'),
        type: "Garantie financière avec date d'échéance et à renouveler",
      });

      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError);
    });
  });
  describe('when the project has been notified', () => {
    describe(`when the project is "Eliminé"`, () => {
      it('should retourn an error', () => {
        const appelOffreId = 'Fessenheim';
        const periodeId = '2';
        const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Eliminé' });
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

        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          }),
        );

        const gfDate = new Date('2022-02-21');
        const fileId = 'file-id';
        const dateEchéance = new Date('2025-01-01');

        const res = project.submitGarantiesFinancieres({
          gfDate,
          fileId,
          submittedBy: fakeUser,
          dateEchéance,
          type: "Garantie financière avec date d'échéance et à renouveler",
        });

        expect(res.isErr()).toEqual(true);
        if (res.isOk()) return;
        expect(res.error).toBeInstanceOf(GFImpossibleASoumettreError);
      });
    });
    describe('when project GF has to be submitted on Potentiel after application to AO (CRE4)', () => {
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
      describe('when project already have a GF', () => {
        it('should return a GFCertificateHasAlreadyBeenSentError', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectGFSubmitted({
                  payload: {
                    projectId: projectId.toString(),
                    gfDate: new Date('2022-02-20'),
                    fileId: 'file-id1',
                    submittedBy: 'user-id',
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
          const res = project.submitGarantiesFinancieres({
            gfDate: new Date('2022-02-21'),
            fileId: 'file-id2',
            submittedBy: fakeUser,
            type: 'Consignation',
          });
          expect(res.isErr()).toEqual(true);
          if (res.isOk()) return;
          expect(res.error).toBeInstanceOf(GFCertificateHasAlreadyBeenSentError);
        });
      });
      describe('when the project is abandoned', () => {
        it('should return an error', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: [
                ...fakeHistory,
                new ProjectAbandoned({
                  payload: {
                    projectId: projectId.toString(),
                    abandonAcceptedBy: 'id',
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

          const gfDate = new Date('2022-02-21');
          const fileId = 'file-id';

          const res = project.submitGarantiesFinancieres({
            gfDate,
            fileId,
            submittedBy: fakeUser,
            type: 'Consignation',
          });

          expect(res.isErr()).toEqual(true);
          if (res.isOk()) return;
          expect(res.error).toBeInstanceOf(GFImpossibleASoumettreError);
        });
      });
      describe('when GF has not been submitted on Potentiel yet', () => {
        it(`Lorsque des garanties financières sont soumises avec une date d'échéance
            Alors le fichier, le type et la date d'échéance devraient être enregistrés`, () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            }),
          );

          const gfDate = new Date('2022-02-21');
          const fileId = 'file-id';
          const dateEchéance = new Date('2025-01-01');

          project.submitGarantiesFinancieres({
            gfDate,
            fileId,
            submittedBy: fakeUser,
            dateEchéance,
            type: "Garantie financière avec date d'échéance et à renouveler",
          });

          expect(project.pendingEvents).toHaveLength(2);

          const submitEvent = project.pendingEvents[0];
          if (!submitEvent) return;

          expect(submitEvent.type).toEqual(ProjectGFSubmitted.type);
          expect(submitEvent.payload).toEqual({
            projectId: projectId.toString(),
            fileId,
            submittedBy: fakeUser.id,
            gfDate,
          });

          const typeEtDateEchéanceEvent = project.pendingEvents[1];
          if (!typeEtDateEchéanceEvent) return;

          expect(typeEtDateEchéanceEvent.type).toEqual(
            TypeGarantiesFinancièresEtDateEchéanceTransmis.type,
          );
          expect(typeEtDateEchéanceEvent.payload).toEqual({
            projectId: projectId.toString(),
            dateEchéance: dateEchéance.toISOString(),
            type: "Garantie financière avec date d'échéance et à renouveler",
          });
        });

        it(`Lorsque des garanties financières sont soumises
            Alors le fichier et le type devraient être enregistrés`, () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            }),
          );

          const gfDate = new Date('2022-02-21');
          const fileId = 'file-id';

          project.submitGarantiesFinancieres({
            gfDate,
            fileId,
            submittedBy: fakeUser,
            type: 'Consignation',
          });

          expect(project.pendingEvents).toHaveLength(2);

          const submitEvent = project.pendingEvents[0];
          if (!submitEvent) return;

          expect(submitEvent.type).toEqual(ProjectGFSubmitted.type);
          expect(submitEvent.payload).toEqual({
            projectId: projectId.toString(),
            fileId,
            submittedBy: fakeUser.id,
            gfDate,
          });

          const typeEtDateEchéanceEvent = project.pendingEvents[1];
          if (!typeEtDateEchéanceEvent) return;

          expect(typeEtDateEchéanceEvent.type).toEqual(
            TypeGarantiesFinancièresEtDateEchéanceTransmis.type,
          );
          expect(typeEtDateEchéanceEvent.payload).toEqual({
            projectId: projectId.toString(),
            type: 'Consignation',
          });
        });
      });
    });
  });
});
