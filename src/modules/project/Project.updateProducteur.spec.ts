import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest } from '@core/utils'
import { appelsOffreStatic } from '@dataAccess/inMemory'
import { makeUser } from '@entities'
import moment from 'moment'
import { UnwrapForTest as OldUnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import {
  EliminatedProjectCannotBeAbandonnedError,
  ProjectCannotBeUpdatedIfUnnotifiedError,
} from './errors'
import {
  LegacyProjectSourced,
  ProjectGFDueDateSet,
  ProjectGFInvalidated,
  ProjectGFSubmitted,
  ProjectGFSubmittedPayload,
  ProjectProducteurUpdated,
} from './events'
import { makeProject } from './Project'

const projectId = new UniqueEntityID('project1')
const appelOffreId = 'Fessenheim'
const periodeId = '2'
const fakeProject = makeFakeProject({ appelOffreId, periodeId, classe: 'Classé' })
const { familleId, numeroCRE } = fakeProject

const fakeUser = OldUnwrapForTest(makeUser(makeFakeUser()))

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const newProducteur = 'newProducteur'

describe('Project.updateProducteur()', () => {
  describe('when project has been notified', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              potentielIdentifier: '',
              appelOffreId: 'Fessenheim',
              periodeId: '3',
              familleId: '3', // <-- no GF
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 123 },
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should emit a ProjectProducteurUpdated event', () => {
      project.updateProducteur(fakeUser, newProducteur)

      expect(project.pendingEvents).toHaveLength(1)

      const targetEvent = project.pendingEvents[0]
      if (!targetEvent) return

      expect(targetEvent.type).toEqual(ProjectProducteurUpdated.type)
      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.updatedBy).toEqual(fakeUser.id)
      expect(targetEvent.payload.newProducteur).toEqual(newProducteur)
    })

    describe('when the project in an AO with GF', () => {
      const project = UnwrapForTest(
        makeProject({
          projectId,
          history: [
            new LegacyProjectSourced({
              payload: {
                projectId: projectId.toString(),
                potentielIdentifier: '',
                appelOffreId: 'Fessenheim',
                periodeId: '3',
                familleId: '1',
                numeroCRE,
                content: { ...fakeProject, notifiedOn: 123 },
              },
            }),
          ],
          appelsOffres,
          buildProjectIdentifier: () => '',
        })
      )

      it('should emit ProjectGFDueDateSet for 1 month from now', () => {
        project.updateProducteur(fakeUser, newProducteur)

        expect(project.pendingEvents).toHaveLength(2)

        const targetEvent = project.pendingEvents.find(
          (event): event is ProjectGFDueDateSet => event.type === ProjectGFDueDateSet.type
        )
        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(
          moment(targetEvent.payload.garantiesFinancieresDueOn).isSame(
            moment(targetEvent.occurredAt).add(1, 'months'),
            'day'
          )
        ).toEqual(true)
      })

      describe('when the project had submitted GF', () => {
        const project = UnwrapForTest(
          makeProject({
            projectId,
            history: [
              new LegacyProjectSourced({
                payload: {
                  projectId: projectId.toString(),
                  potentielIdentifier: '',
                  appelOffreId: 'Fessenheim',
                  periodeId: '3',
                  familleId: '1',
                  numeroCRE,
                  content: { ...fakeProject, notifiedOn: 123 },
                },
              }),
              new ProjectGFSubmitted({
                payload: { projectId: projectId.toString() } as ProjectGFSubmittedPayload,
              }),
            ],
            appelsOffres,
            buildProjectIdentifier: () => '',
          })
        )

        it('should emit ProjectGFInvalidated', () => {
          project.updateProducteur(fakeUser, newProducteur)

          expect(project.pendingEvents).toHaveLength(3)

          const targetEvent = project.pendingEvents.find(
            (event): event is ProjectGFInvalidated => event.type === ProjectGFInvalidated.type
          )
          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(projectId.toString())
        })
      })
    })
  })

  describe('when project has not been notified', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              potentielIdentifier: '',
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: 0 },
            },
          }),
        ],
        appelsOffres,
        buildProjectIdentifier: () => '',
      })
    )

    it('should return ProjectCannotBeUpdatedIfUnnotifiedError', () => {
      const res = project.updateProducteur(fakeUser, newProducteur)
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
      expect(project.pendingEvents.length).toEqual(0)
    })
  })
})
