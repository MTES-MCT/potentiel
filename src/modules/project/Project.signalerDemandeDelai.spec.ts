import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  DemandeDelaiSignaled,
  ProjectCompletionDueDateSet,
  ProjectImported,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'
import { makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'
import { makeUser } from '@entities'

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const projectId = new UniqueEntityID()
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

describe('Project.signalerDemandeDelai()', () => {
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
        })
      )
      const res = project.signalerDemandeDelai({
        decidedOn: new Date('2022-04-12'),
        newCompletionDueOn: new Date('2025-04-12'),
        status: 'rejetée',
        attachments: [],
        signaledBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isErr()) {
        expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
      }
    })
  })
  describe('when the project has been notified', () => {
    describe('when project has a completion due date later than the new one', () => {
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
        new ProjectCompletionDueDateSet({
          payload: {
            projectId: projectId.toString(),
            completionDueOn: new Date('2025-01-31').getTime(),
          },
          original: {
            occurredAt: new Date(456),
            version: 1,
          },
        }),
      ]
      it('should emit a DemandeDelaiSignaled event with isNewDateApplicable=false', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        const newCompletionDueOn = new Date('2024-01-31')

        project.signalerDemandeDelai({
          decidedOn: new Date('2022-04-12'),
          newCompletionDueOn,
          status: 'acceptée',
          notes: 'notes',
          attachments: [{ id: 'file-id', name: 'file-name' }],
          signaledBy: fakeUser,
        })

        expect(project.pendingEvents).toHaveLength(1)

        const targetEvent = project.pendingEvents[0]
        if (!targetEvent) return

        expect(targetEvent.type).toEqual(DemandeDelaiSignaled.type)
        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
        expect(targetEvent.payload.newCompletionDueOn).toEqual(newCompletionDueOn.getTime())
        expect(targetEvent.payload.status).toEqual('acceptée')
        expect(targetEvent.payload.isNewDateApplicable).toEqual(false)
        expect(targetEvent.payload.notes).toEqual('notes')
        expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
        expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
      })
    })
    describe('when project has a completion due date earlier than the new one', () => {
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
            notifiedOn: new Date('2022-04-12').getTime(),
          },
          original: {
            occurredAt: new Date(456),
            version: 1,
          },
        }),
        new ProjectCompletionDueDateSet({
          payload: {
            projectId: projectId.toString(),
            completionDueOn: new Date('2023-01-31').getTime(),
          },
          original: {
            occurredAt: new Date(456),
            version: 1,
          },
        }),
      ]
      it('should emit a DemandeDelaiSignaled event with isNewDateApplicable=true', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        const newCompletionDueOn = new Date('2024-01-31')

        project.signalerDemandeDelai({
          decidedOn: new Date('2022-04-12'),
          newCompletionDueOn,
          status: 'acceptée',
          notes: 'notes',
          attachments: [{ id: 'file-id', name: 'file-name' }],
          signaledBy: fakeUser,
        })

        expect(project.pendingEvents).toHaveLength(1)

        const targetEvent = project.pendingEvents[0]
        if (!targetEvent) return

        expect(targetEvent.type).toEqual(DemandeDelaiSignaled.type)
        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
        expect(targetEvent.payload.newCompletionDueOn).toEqual(newCompletionDueOn.getTime())
        expect(targetEvent.payload.status).toEqual('acceptée')
        expect(targetEvent.payload.isNewDateApplicable).toEqual(true)
        expect(targetEvent.payload.notes).toEqual('notes')
        expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
        expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
      })
    })
  })
})
