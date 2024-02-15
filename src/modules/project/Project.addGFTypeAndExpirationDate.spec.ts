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
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors';
import { NoGFCertificateToUpdateError } from './errors/NoGFCertificateToUpdateError';

const projectId = new UniqueEntityID();
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic);
const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()));
const appelOffreId = 'Fessenheim';
const periodeId = '2';
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' });
const { familleId, numeroCRE, potentielIdentifier } = fakeProject;

describe('Project.addGFTypeAndExpirationDate()', () => {
  describe('Etant donné un projet non notifié', () => {
    it('Alors une erreur ProjectCannotBeUpdatedIfUnnotifiedError devrait être retournée', () => {
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

      const res = project.addGFTypeAndExpirationDate({
        projectId: projectId.toString(),
        submittedBy: fakeUser,
        type: 'Consignation',
      });
      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError);
    });
  });

  describe('Projet notifié', () => {
    it(`Etant donné un projet sans garanties financières
        Lorsque le type est transmise
        Alors une erreur NoGFCertificateToUpdateError devrait être retournée`, () => {
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

      const res = project.addGFTypeAndExpirationDate({
        projectId: projectId.toString(),
        submittedBy: fakeUser,
        type: 'Consignation',
      });

      expect(res.isErr()).toEqual(true);
      if (res.isOk()) return;
      expect(res.error).toBeInstanceOf(NoGFCertificateToUpdateError);
    });

    describe('Projet avec GF', () => {
      it(`Lorsque le type change
          Alors le nouveau type devrait être enregistré`, () => {
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
              type: 'Autre type',
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
            history: [...fakeHistory],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          }),
        );

        const res = project.addGFTypeAndExpirationDate({
          projectId: projectId.toString(),
          submittedBy: fakeUser,
          type: 'Consignation',
        });

        expect(res.isOk()).toEqual(true);
        expect(project.pendingEvents).toHaveLength(1);
        expect(project.pendingEvents[0].type).toEqual(
          'TypeGarantiesFinancièresEtDateEchéanceTransmis',
        );
        expect(project.pendingEvents[0].payload.type).toEqual('Consignation');
      });

      it(`Etant donné un projet avec des garanties financières avec date d'échéance
        Lorsque le type est modifié
        Alors le date d'échéance devrait être supprimée
        Et le nouveau type devrait être enregistré`, () => {
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
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [...fakeHistory],
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          }),
        );

        const res = project.addGFTypeAndExpirationDate({
          projectId: projectId.toString(),
          submittedBy: fakeUser,
          type: 'Consignation',
        });

        expect(res.isOk()).toEqual(true);
        expect(project.pendingEvents).toHaveLength(2);
        expect(project.pendingEvents[0].type).toEqual('DateEchéanceGarantiesFinancièresSupprimée');
        expect(project.pendingEvents[1].type).toEqual(
          'TypeGarantiesFinancièresEtDateEchéanceTransmis',
        );
        expect(project.pendingEvents[1].payload.type).toEqual('Consignation');
      });
    });
  });
});
