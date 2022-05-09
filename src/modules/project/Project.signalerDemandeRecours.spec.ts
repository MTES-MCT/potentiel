import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import makeFakeProject from '../../__tests__/fixtures/project'
import { DemandeRecoursSignaled, ProjectImported, ProjectNotified } from './events'
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
})
