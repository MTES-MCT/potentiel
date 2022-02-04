import moment from 'moment'
import { DomainEvent, UniqueEntityID } from '@core/domain'
import { logger, UnwrapForTest } from '@core/utils'
import { appelsOffreStatic, getDelaiDeRealisation } from '@dataAccess/inMemory'
import { makeUser } from '@entities'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { IllegalProjectStateError, ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import {
  LegacyProjectSourced,
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectGFDueDateSet,
  ProjectImported,
  ProjectNotificationDateSet,
  ProjectNotified,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE, potentielIdentifier } = fakeProject

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
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

describe('Project.setNotificationDate()', () => {
  describe('when the given date is different than the current date', () => {
    const newNotifiedOn = 123 + 24 * 60 * 60 * 1000

    it('should emit a ProjectNotificationDateSet', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: fakeHistory,
          appelsOffres,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.setNotificationDate(fakeUser, newNotifiedOn)

      expect(res.isOk()).toBe(true)
      if (res.isErr()) return

      expect(project.pendingEvents).not.toHaveLength(0)

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectNotificationDateSet.type
      ) as ProjectNotificationDateSet | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.notifiedOn).toEqual(newNotifiedOn)
      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.setBy).toEqual(fakeUser.id)
    })

    describe('when project is classé', () => {
      const fakeProjectData = makeFakeProject({ notifiedOn: 123, classe: 'Classé', appelOffreId })
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
        const res = project.setNotificationDate(fakeUser, newNotifiedOn)

        if (res.isErr()) logger.error(res.error)
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
          moment(newNotifiedOn).add(2, 'months').toDate().getTime()
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
          moment(newNotifiedOn)
            .add(getDelaiDeRealisation(appelOffreId, ''), 'months')
            .subtract(1, 'day')
            .toDate()
            .getTime()
        )
      })
    })

    describe('when project already had a updated completion due date', () => {
      const fakeHistoryWithCompletionDateMoved = [
        ...fakeHistory,
        // First event corresponds to notification
        new ProjectCompletionDueDateSet({
          payload: { projectId: projectId.toString(), completionDueOn: 1234 },
        }),
        // Second event corresponds to a change in completion date
        new ProjectCompletionDueDateSet({
          payload: { projectId: projectId.toString(), completionDueOn: 4567 },
        }),
      ]

      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: fakeHistoryWithCompletionDateMoved,
          appelsOffres,
          buildProjectIdentifier: () => '',
        })
      )

      beforeAll(() => {
        const res = project.setNotificationDate(fakeUser, newNotifiedOn)

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toBe(true)
      })

      it('should not trigger ProjectCompletionDueDateSet', () => {
        const targetEvent = project.pendingEvents.find(
          (item) => item.type === ProjectCompletionDueDateSet.type
        ) as ProjectCompletionDueDateSet | undefined
        expect(targetEvent).not.toBeDefined()
      })
    })

    describe('when project is éliminé', () => {
      const fakeProjectData = makeFakeProject({ notifiedOn: 123, classe: 'Eliminé' })
      const fakeHistory = makeFakeHistory(fakeProjectData)

      it('should not trigger ProjectDCRDueDateSet', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            appelsOffres,
            buildProjectIdentifier: () => '',
          })
        )
        const res = project.setNotificationDate(fakeUser, newNotifiedOn)

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toBe(true)
        if (res.isErr()) return

        const targetEvent = project.pendingEvents.find(
          (item) => item.type === ProjectDCRDueDateSet.type
        ) as ProjectDCRDueDateSet | undefined
        expect(targetEvent).not.toBeDefined()
      })
    })

    describe('when project family warrants a garantie financiere', () => {
      const fakeProjectData = makeFakeProject({
        notifiedOn: 123,
        appelOffreId: 'Fessenheim',
        periodeId: '2',
        familleId: '1',
        classe: 'Classé',
      })
      const fakeHistory = makeFakeHistory(fakeProjectData)

      it('should trigger ProjectGFDueDateSet', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            appelsOffres,
            buildProjectIdentifier: () => '',
          })
        )
        const res = project.setNotificationDate(fakeUser, newNotifiedOn)

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toBe(true)
        if (res.isErr()) return

        const targetEvent = project.pendingEvents.find(
          (item) => item.type === ProjectGFDueDateSet.type
        ) as ProjectGFDueDateSet | undefined
        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        expect(targetEvent.payload.garantiesFinancieresDueOn).toEqual(
          moment(newNotifiedOn).add(2, 'months').toDate().getTime()
        )
      })
    })

    describe('when project family does not warrant a garantie financiere', () => {
      const fakeProjectData = makeFakeProject({
        notifiedOn: 123,
        appelOffreId: 'Fessenheim',
        periodeId: '2',
        familleId: '3',
        classe: 'Classé',
      })
      const fakeHistory = makeFakeHistory(fakeProjectData)

      it('should not trigger ProjectGFDueDateSet', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: fakeHistory,
            appelsOffres,
            buildProjectIdentifier: () => '',
          })
        )
        const res = project.setNotificationDate(fakeUser, newNotifiedOn)

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toBe(true)
        if (res.isErr()) return

        const targetEvent = project.pendingEvents.find(
          (item) => item.type === ProjectGFDueDateSet.type
        ) as ProjectGFDueDateSet | undefined
        expect(targetEvent).not.toBeDefined()
      })
    })
  })

  describe('when the given date is the same as the current date', () => {
    it('should not emit', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: fakeHistory,
          appelsOffres,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.setNotificationDate(fakeUser, 123)

      expect(res.isOk()).toBe(true)
      if (res.isErr()) return

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when project is not notified', () => {
    it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          appelsOffres,
          history: fakeHistory.filter((event) => event.type !== ProjectNotified.type),
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.setNotificationDate(fakeUser, 1)

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
    })
  })

  describe('when new notifiedOn is 0', () => {
    it('should return a IllegalProjectStateError', () => {
      // Create a project that has not been notified
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: fakeHistory,
          appelsOffres,
          buildProjectIdentifier: () => '',
        })
      )

      const res = project.setNotificationDate(fakeUser, 0)

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(IllegalProjectStateError)
    })
  })
})
