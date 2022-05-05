import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  DemandeAbandonSignaled,
  ProjectAbandoned,
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

describe('Project.signalerDemandeAbandon()', () => {
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
      const res = project.signalerDemandeAbandon({
        decidedOn: new Date('2022-04-12'),
        status: 'rejetée',
        signaledBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isErr()) {
        expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
      }
    })
  })
  describe('when the project has been notified', () => {
    describe('when project is not abandonned', () => {
      describe(`if it's accepted`, () => {
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
        it('should emit a DemandeAbandonSignaled event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          project.signalerDemandeAbandon({
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          expect(project.pendingEvents).toHaveLength(2)

          const targetEvent = project.pendingEvents[0]
          if (!targetEvent) return

          expect(targetEvent.type).toEqual(DemandeAbandonSignaled.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
          expect(targetEvent.payload.status).toEqual('acceptée')
          expect(targetEvent.payload.notes).toEqual('notes')
          expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
          expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
        })
        it('should emit a ProjectAbandonned event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          const decidedOn = new Date('2022-04-12')

          project.signalerDemandeAbandon({
            decidedOn,
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          expect(project.pendingEvents).toHaveLength(2)

          const targetEvent = project.pendingEvents[1]
          if (!targetEvent) return

          expect(targetEvent.type).toEqual(ProjectAbandoned.type)
          expect(targetEvent.occurredAt).toEqual(decidedOn)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.abandonAcceptedBy).toEqual(fakeUser.id)
        })
      })
      describe(`if it's rejected`, () => {
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
        it('should only emit a DemandeAbandonSignaled event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          project.signalerDemandeAbandon({
            decidedOn: new Date('2022-04-12'),
            status: 'rejetée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          expect(project.pendingEvents).toHaveLength(1)

          const targetEvent = project.pendingEvents[0]
          if (!targetEvent) return

          expect(targetEvent.type).toEqual(DemandeAbandonSignaled.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
          expect(targetEvent.payload.status).toEqual('rejetée')
          expect(targetEvent.payload.notes).toEqual('notes')
          expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
          expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
        })
      })
    })
    describe('when project was already abandoned', () => {
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
        new ProjectAbandoned({
          payload: {
            projectId: projectId.toString(),
            abandonAcceptedBy: 'fake-user',
          },
          original: {
            occurredAt: new Date(456),
            version: 1,
          },
        }),
      ]
      it('should only emit a DemandeAbandonSignaled event', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        project.signalerDemandeAbandon({
          decidedOn: new Date('2022-04-12'),
          status: 'acceptée',
          notes: 'notes',
          attachment: { id: 'file-id', name: 'file-name' },
          signaledBy: fakeUser,
        })

        expect(project.pendingEvents).toHaveLength(1)

        const targetEvent = project.pendingEvents[0]
        if (!targetEvent) return

        expect(targetEvent.type).toEqual(DemandeAbandonSignaled.type)
        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
        expect(targetEvent.payload.status).toEqual('acceptée')
        expect(targetEvent.payload.notes).toEqual('notes')
        expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
        expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
      })
    })
  })
})
