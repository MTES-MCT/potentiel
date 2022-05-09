import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  DemandeRecoursSignaled,
  ProjectCertificateUpdated,
  ProjectClasseGranted,
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'
import { getDelaiDeRealisation, makeGetProjectAppelOffre } from '@modules/projectAppelOffre'
import { ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'
import { makeUser } from '@entities'
import { add } from 'date-fns'

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))
const getProjectAppelOffre = makeGetProjectAppelOffre(appelsOffreStatic)
const projectId = new UniqueEntityID()
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

describe('Project.signalerDemandeRecours()', () => {
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
      const res = project.signalerDemandeRecours({
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
    describe(`when the request is rejected`, () => {
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
      ]
      it('should emit a DemandeRecoursSignaled event', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            getProjectAppelOffre,
            buildProjectIdentifier: () => '',
          })
        )

        project.signalerDemandeRecours({
          decidedOn: new Date('2022-04-12'),
          status: 'rejetée',
          notes: 'notes',
          attachment: { id: 'file-id', name: 'file-name' },
          signaledBy: fakeUser,
        })

        expect(project.pendingEvents).toHaveLength(1)

        const targetEvent = project.pendingEvents[0]
        if (!targetEvent) return

        expect(targetEvent.type).toEqual(DemandeRecoursSignaled.type)
        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
        expect(targetEvent.payload.status).toEqual('rejetée')
        expect(targetEvent.payload.notes).toEqual('notes')
        expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
        expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
      })
    })
    describe(`when the request is accepted`, () => {
      describe(`when the project is lauréat`, () => {
        const fakeHistory: DomainEvent[] = [
          new ProjectImported({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              importId: '',
              data: {
                ...fakeProject,
                classe: 'Classé',
              },
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
        ]
        it('should emit a DemandeRecoursSignaled event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          project.signalerDemandeRecours({
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          expect(project.pendingEvents).toHaveLength(1)

          const targetEvent = project.pendingEvents[0]
          if (!targetEvent) return

          expect(targetEvent.type).toEqual(DemandeRecoursSignaled.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
          expect(targetEvent.payload.status).toEqual('acceptée')
          expect(targetEvent.payload.notes).toEqual('notes')
          expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
          expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
        })
      })
      describe(`when the project is éliminé`, () => {
        const fakeHistory: DomainEvent[] = [
          new ProjectImported({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              importId: '',
              data: {
                ...fakeProject,
                classe: 'Éliminé',
              },
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
        ]

        it('should emit a DemandeRecoursSignaled event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          project.signalerDemandeRecours({
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          expect(project.pendingEvents).toHaveLength(7)

          const targetEvent = project.pendingEvents[0]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(DemandeRecoursSignaled.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.decidedOn).toEqual(new Date('2022-04-12').getTime())
          expect(targetEvent.payload.status).toEqual('acceptée')
          expect(targetEvent.payload.notes).toEqual('notes')
          expect(targetEvent.payload.attachments).toEqual([{ id: 'file-id', name: 'file-name' }])
          expect(targetEvent.payload.signaledBy).toEqual(fakeUser.id)
        })

        it('should emit a ProjectClasseGranted event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          project.signalerDemandeRecours({
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          const targetEvent = project.pendingEvents[1]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(ProjectClasseGranted.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.grantedBy).toEqual(fakeUser.id)
        })

        it('should emit a ProjectCertificateUpdated event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          project.signalerDemandeRecours({
            decidedOn: new Date('2022-04-12'),
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          const targetEvent = project.pendingEvents[2]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(ProjectCertificateUpdated.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.certificateFileId).toEqual('file-id')
          expect(targetEvent.payload.uploadedBy).toEqual(fakeUser.id)
        })

        it('should emit a ProjectNotificationDateSet event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          const decidedOn = new Date('2022-04-12')

          project.signalerDemandeRecours({
            decidedOn,
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          const targetEvent = project.pendingEvents[3]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(ProjectNotificationDateSet.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.notifiedOn).toEqual(decidedOn.getTime())
          expect(targetEvent.payload.setBy).toEqual(fakeUser.id)
        })

        it('should emit a ProjectDCRDueDateSet event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          const decidedOn = new Date('2022-04-12')

          project.signalerDemandeRecours({
            decidedOn,
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          const targetEvent = project.pendingEvents[4]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(ProjectDCRDueDateSet.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.dcrDueOn).toEqual(
            new Date(decidedOn.setMonth(decidedOn.getMonth() + 2)).getTime()
          )
        })

        it('should emit a ProjectGFDueDateSet event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          const decidedOn = new Date('2022-04-12')

          project.signalerDemandeRecours({
            decidedOn,
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          const targetEvent = project.pendingEvents[5]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(ProjectGFDueDateSet.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.garantiesFinancieresDueOn).toEqual(
            new Date(decidedOn.setMonth(decidedOn.getMonth() + 2)).getTime()
          )
        })

        it('should emit a ProjectCompletionDueDateSet event', () => {
          const project = UnwrapForTest(
            makeProject({
              projectId,
              history: fakeHistory,
              getProjectAppelOffre,
              buildProjectIdentifier: () => '',
            })
          )

          const decidedOn = new Date('2022-04-12')

          project.signalerDemandeRecours({
            decidedOn,
            status: 'acceptée',
            notes: 'notes',
            attachment: { id: 'file-id', name: 'file-name' },
            signaledBy: fakeUser,
          })

          const targetEvent = project.pendingEvents[6]

          expect(targetEvent).toBeDefined()
          expect(targetEvent.type).toEqual(ProjectCompletionDueDateSet.type)
          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
          expect(targetEvent.payload.completionDueOn).toEqual(
            add(decidedOn, { days: -1, months: 24 }).getTime()
          )
        })
      })
    })
  })
})
