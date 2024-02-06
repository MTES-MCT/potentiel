import { describe, expect, it } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '../../core/domain';
import { UnwrapForTest } from '../../core/utils';
import makeFakeProject from '../../__tests__/fixtures/project';
import { makeProject } from './Project';
import { makeGetProjectAppelOffre } from '../projectAppelOffre';
import { appelsOffreStatic } from '../../dataAccess/inMemory';
import {
  ProjectGFSubmitted,
  ProjectImported,
  ProjectNotified,
  TypeGarantiesFinancièresEtDateEchéanceTransmis,
} from './events';
import { UnwrapForTest as OldUnwrapForTest } from '../../types';
import makeFakeUser from '../../__tests__/fixtures/user';
import { makeUser } from '../../entities';
import {
  DateEchéanceIncompatibleAvecLeTypeDeGFError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from './errors';
import { NoGFCertificateToUpdateError } from './errors/NoGFCertificateToUpdateError';

const projectId = new UniqueEntityID();
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);
const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));
const appelOffreId = 'Fessenheim';
const periodeId = '2';
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
const { familleId, numeroCRE, potentielIdentifier } = fakeProject;

describe('Project.addGFExpirationDate()', () => {
  describe('when the project has not been notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          getProjectAppelOffre,
          history: [
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
          ],
          buildProjectIdentifier: () => '',
        }),
      );

      const res = project.addGFExpirationDate({
        projectId: projectId.toString(),
        submittedBy: fakeUser,
        expirationDate: new Date('2023-01-01'),
      });
      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError);
    });
  });

  describe('when the project has been notified', () => {
    describe("when the project doesn't have GFs", () => {
      it('should return a NoGFCertificateToUpdateError', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
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
            ],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          }),
        );

        const res = project.addGFExpirationDate({
          projectId: projectId.toString(),
          submittedBy: fakeUser,
          expirationDate: new Date('2023-01-01'),
        });

        expect(res.isErr()).toEqual(true);
        if (res.isOk()) return;
        expect(res.error).toBeInstanceOf(NoGFCertificateToUpdateError);
      });
    });

    describe('when the project has GFs', () => {
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
        new TypeGarantiesFinancièresEtDateEchéanceTransmis({
          payload: {
            projectId: projectId.toString(),
            type: "Garantie financière avec date d'échéance et à renouveler",
            dateEchéance: new Date().toISOString(),
          },
          original: {
            occurredAt: new Date(456),
            version: 1,
          },
        }),
      ];
      it('should emit a DateEchéanceGFAjoutée event', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [...fakeHistory],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          }),
        );

        const res = project.addGFExpirationDate({
          projectId: projectId.toString(),
          submittedBy: fakeUser,
          expirationDate: new Date('2023-01-01'),
        });

        expect(res.isOk()).toEqual(true);
        expect(project.pendingEvents).toHaveLength(1);
        expect(project.pendingEvents[0].type).toEqual('DateEchéanceGFAjoutée');
        expect(project.pendingEvents[0].payload.expirationDate).toEqual(new Date('2023-01-01'));
      });
    });
  });

  describe('vérification du type de garanties financières', () => {
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
    ];
    for (const type of [
      "Garantie financière jusqu'à 6 mois après la date d'achèvement",
      'Consignation',
    ]) {
      it(`Si le type est ${type}
        Alors une erreur devrait être retournée`, () => {
        const ajoutTypeEvent = new TypeGarantiesFinancièresEtDateEchéanceTransmis({
          payload: {
            projectId: projectId.toString(),
            type,
            dateEchéance: new Date().toISOString(),
          },
          original: {
            occurredAt: new Date(456),
            version: 1,
          },
        });
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [...fakeHistory, ajoutTypeEvent],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          }),
        );

        const res = project.addGFExpirationDate({
          projectId: projectId.toString(),
          submittedBy: fakeUser,
          expirationDate: new Date('2023-01-01'),
        });

        expect(res.isErr()).toEqual(true);
        if (res.isOk()) return;
        expect(res.error).toBeInstanceOf(DateEchéanceIncompatibleAvecLeTypeDeGFError);
      });
    }

    it(`Si le type est "Garantie financière avec date d'échéance et à renouveler"
        Alors la date d'échéance devrait être enregistrée`, () => {
      const ajoutTypeEvent = new TypeGarantiesFinancièresEtDateEchéanceTransmis({
        payload: {
          projectId: projectId.toString(),
          type: "Garantie financière avec date d'échéance et à renouveler",
          dateEchéance: new Date().toISOString(),
        },
        original: {
          occurredAt: new Date(456),
          version: 1,
        },
      });
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [...fakeHistory, ajoutTypeEvent],
          getProjectAppelOffre,
          buildProjectIdentifier: () => '',
        }),
      );

      const res = project.addGFExpirationDate({
        projectId: projectId.toString(),
        submittedBy: fakeUser,
        expirationDate: new Date('2023-01-01'),
      });

      expect(res.isOk()).toEqual(true);
      expect(project.pendingEvents).toHaveLength(1);
      expect(project.pendingEvents[0].type).toEqual('DateEchéanceGFAjoutée');
      expect(project.pendingEvents[0].payload.expirationDate).toEqual(new Date('2023-01-01'));
    });
  });
});
