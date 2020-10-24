import moment from 'moment'
import { okAsync } from '../../../core/utils'
import { Famille, makeProject, Project } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { GetFamille } from '../../appelOffre'
import { StoredEvent } from '../../eventStore'
import { InfraNotAvailableError } from '../../shared'
import { ProjectDCRDueDateSet, ProjectGFDueDateSet, ProjectNotificationDateSet } from '../events'
import { handleProjectNotificationDateSet } from './handleProjectNotificationDateSet'

const eventBus = {
  publish: jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null)),
  subscribe: jest.fn(),
}

describe('handleProjectNotificationDateSet', () => {
  describe('when project is classé', () => {
    const project = UnwrapForTest(
      makeProject(
        makeFakeProject({
          classe: 'Classé',
        })
      )
    )
    const findProjectById = jest.fn(async (projectId: Project['id']) => project)

    it('should trigger ProjectDCRDueDateSet', async () => {
      const fakeFamille: Famille = {
        id: 'famille1',
        title: 'familletitle',
        garantieFinanciereEnMois: 0,
      }

      const getFamille: GetFamille = jest.fn((appelOffreId, familleId) => okAsync(fakeFamille))

      eventBus.publish.mockClear()

      await handleProjectNotificationDateSet({
        eventBus,
        findProjectById,
        getFamille,
      })(
        new ProjectNotificationDateSet({
          payload: {
            projectId: project.id,
            notifiedOn: 123456789,
          },
        })
      )

      expect(eventBus.publish).toHaveBeenCalled()
      const event = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectDCRDueDateSet.type)

      expect(event!.aggregateId).toEqual(project.id)
      expect(event!.payload).toEqual({
        projectId: project.id,
        dcrDueOn: moment(123456789).add(2, 'months').toDate().getTime(),
      })
    })

    describe('when project family warrants garantie financiere', () => {
      const fakeFamille: Famille = {
        id: 'famille1',
        title: 'familletitle',
        garantieFinanciereEnMois: 17,
      }
      const getFamille: GetFamille = jest.fn((appelOffreId, familleId) => okAsync(fakeFamille))

      it('should emit ProjectGFDueDateSet', async () => {
        eventBus.publish.mockClear()

        await handleProjectNotificationDateSet({
          eventBus,
          findProjectById,
          getFamille,
        })(
          new ProjectNotificationDateSet({
            payload: {
              projectId: project.id,
              notifiedOn: 123456789,
            },
          })
        )

        expect(eventBus.publish).toHaveBeenCalled()
        const event = eventBus.publish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectGFDueDateSet.type)

        expect(event).toBeDefined()
        expect(event!.type).toEqual(ProjectGFDueDateSet.type)
        expect(event!.aggregateId).toEqual(project.id)
        expect(event!.payload).toEqual({
          projectId: project.id,
          garantiesFinancieresDueOn: moment(123456789).add(2, 'months').toDate().getTime(),
        })
      })
    })

    describe('when project family does not warrant garantie financiere', () => {
      const fakeFamille: Famille = {
        id: 'famille1',
        title: 'familletitle',
        garantieFinanciereEnMois: 0,
      }
      const getFamille: GetFamille = jest.fn((appelOffreId, familleId) => okAsync(fakeFamille))

      it('should not emit ProjectGFDueDateSet', async () => {
        eventBus.publish.mockClear()
        await handleProjectNotificationDateSet({
          eventBus,
          findProjectById,
          getFamille,
        })(
          new ProjectNotificationDateSet({
            payload: {
              projectId: project.id,
              notifiedOn: 123456789,
            },
          })
        )

        const illegalEvent = eventBus.publish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectGFDueDateSet.type)

        expect(illegalEvent).not.toBeDefined()
      })
    })
  })

  describe('when project is éliminé', () => {
    const project = UnwrapForTest(
      makeProject(
        makeFakeProject({
          classe: 'Eliminé',
        })
      )
    )
    const findProjectById = jest.fn(async (projectId: Project['id']) => project)

    it('should not trigger any event', async () => {
      eventBus.publish.mockClear()

      const getFamille: GetFamille = jest.fn()

      await handleProjectNotificationDateSet({
        eventBus,
        findProjectById,
        getFamille,
      })(
        new ProjectNotificationDateSet({
          payload: {
            projectId: project.id,
            notifiedOn: 123456789,
          },
        })
      )

      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})
