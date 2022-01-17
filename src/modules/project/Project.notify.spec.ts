import moment from 'moment'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import { AppelOffre } from '../../entities'
import makeFakeProject from '../../__tests__/fixtures/project'
import { ProjectAlreadyNotifiedError } from './errors'
import {
  LegacyProjectSourced,
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')

const appelsOffres: Record<string, AppelOffre> = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const makeFakeHistory = (fakeProject: any): DomainEvent[] => {
  return [
    new LegacyProjectSourced({
      payload: {
        projectId: projectId.toString(),
        periodeId: fakeProject.periodeId,
        appelOffreId: fakeProject.appelOffreId,
        familleId: fakeProject.familleId,
        numeroCRE: fakeProject.numeroCRE,
        content: fakeProject,
        potentielIdentifier: '',
      },
    }),
  ]
}

describe('Project.notify()', () => {
  const notifiedOn = new Date().getTime()

  it('should emit ProjectNotified', () => {
    const fakeProjectData = makeFakeProject({ notifiedOn: 0 })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: fakeHistory,
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

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

  describe('when project is classé', () => {
    const fakeProjectData = makeFakeProject({
      notifiedOn: 0,
      appelOffreId: 'Fessenheim',
      periodeId: '2',
      familleId: '1',
      classe: 'Classé',
    })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: fakeHistory,
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    beforeAll(() => {
      const res = project.notify(notifiedOn)

      if (res.isErr()) console.error(res.error)
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

    it('should trigger ProjectCompletionDueDateSet', () => {
      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectCompletionDueDateSet.type
      ) as ProjectCompletionDueDateSet | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.completionDueOn).toEqual(
        moment(notifiedOn)
          .add(appelsOffres[fakeProjectData.appelOffreId].delaiRealisationEnMois, 'months')
          .subtract(1, 'day')
          .toDate()
          .getTime()
      )
    })
  })

  describe('when project is classé and family warrants a garantie financiere', () => {
    const fakeProjectData = makeFakeProject({
      notifiedOn: 0,
      appelOffreId: 'Fessenheim',
      periodeId: '2',
      familleId: '1',
      classe: 'Classé',
    })
    const fakeHistory = makeFakeHistory(fakeProjectData)

    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: fakeHistory,
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    beforeAll(() => {
      const res = project.notify(notifiedOn)

      if (res.isErr()) console.error(res.error)
      expect(res.isOk()).toBe(true)
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

      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: fakeHistory,
          appelsOffres,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.notify(notifiedOn)

      expect(res.isErr()).toBe(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(ProjectAlreadyNotifiedError)
      expect(project.pendingEvents).toHaveLength(0)
    })
  })
})
