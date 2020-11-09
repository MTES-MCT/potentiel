import moment from 'moment'
import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { makeUser } from '../../entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { StoredEvent } from '../eventStore'
import { ProjectAlreadyNotifiedError } from './errors'
import {
  LegacyProjectSourced,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const makeFakeHistory = (fakeProject: any): StoredEvent[] => {
  return [
    new LegacyProjectSourced({
      payload: {
        projectId: projectId.toString(),
        periodeId: fakeProject.periodeId,
        appelOffreId: fakeProject.appelOffreId,
        familleId: fakeProject.familleId,
        numeroCRE: fakeProject.numeroCRE,
        content: fakeProject,
      },
    }),
  ]
}

describe('Project.notify()', () => {
  const notifiedOn = new Date().getTime()

  it('should emit ProjectNotified', () => {
    const fakeProjectData = makeFakeProject({ notifiedOn: 0 })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

    const res = project.notify(notifiedOn)

    expect(res.isOk()).toBe(true)
    if (res.isErr()) return

    expect(project.pendingEvents).not.toHaveLength(0)

    const targetEvent = project.pendingEvents.find((item) => item.type === ProjectNotified.type) as
      | ProjectNotified
      | undefined
    expect(targetEvent).toBeDefined()
    if (!targetEvent) return

    expect(targetEvent.payload.notifiedOn).toEqual(notifiedOn)
    expect(targetEvent.payload.projectId).toEqual(projectId.toString())
  })

  describe('when project is classé and family warrants a garantie financiere', () => {
    const fakeProjectData = makeFakeProject({
      notifiedOn: 123,
      appelOffreId: 'Fessenheim',
      periodeId: '2',
      familleId: '1',
      classe: 'Classé',
    })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

    beforeAll(() => {
      const res = project.setNotificationDate(fakeUser, notifiedOn)

      if (res.isErr()) console.log(res.error)
      expect(res.isOk()).toBe(true)
    })

    it('should trigger ProjectDCRDueDateSet', () => {
      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectDCRDueDateSet.type
      ) as ProjectDCRDueDateSet | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.dcrDueOn).toEqual(
        moment(notifiedOn).add(2, 'months').toDate().getTime()
      )
    })

    it('should trigger ProjectGFDueDateSet', () => {
      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectGFDueDateSet.type
      ) as ProjectGFDueDateSet | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.garantiesFinancieresDueOn).toEqual(
        moment(notifiedOn).add(2, 'months').toDate().getTime()
      )
    })
  })

  describe('when project is already notified', () => {
    it('should return a ProjectAlreadyNotifiedError', () => {
      const fakeProjectData = makeFakeProject({ notifiedOn: 1 })
      const fakeHistory = makeFakeHistory(fakeProjectData)

      const project = UnwrapForTest(makeProject({ projectId, history: fakeHistory, appelsOffres }))

      const res = project.notify(notifiedOn)

      expect(res.isErr()).toBe(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(ProjectAlreadyNotifiedError)
      expect(project.pendingEvents).toHaveLength(0)
    })
  })
})
