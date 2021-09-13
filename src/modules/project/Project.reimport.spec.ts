import { UniqueEntityID } from '../../core/domain'
import { UnwrapForTest } from '../../core/utils'
import { appelsOffreStatic } from '../../dataAccess/inMemory/appelOffre'
import makeFakeProject from '../../__tests__/fixtures/project'
import {
  LegacyProjectSourced,
  ProjectActionnaireUpdated,
  ProjectClasseGranted,
  ProjectDataCorrected,
  ProjectFournisseursUpdated,
  ProjectNotificationDateSet,
  ProjectProducteurUpdated,
  ProjectPuissanceUpdated,
  ProjectReimported,
} from './events'
import { makeProject } from './Project'

const appelsOffres = appelsOffreStatic.reduce((map, appelOffre) => {
  map[appelOffre.id] = appelOffre
  return map
}, {})

const projectId = new UniqueEntityID('project1')
const fakeProject = makeFakeProject({
  classe: 'Classé',
  id: projectId.toString(),
  prixReference: 1,
  evaluationCarbone: 2,
  details: {
    detail1: 'detail1',
    detail2: 'detail2',
  },
})
const { periodeId, appelOffreId, familleId, numeroCRE } = fakeProject

const importId = new UniqueEntityID().toString()

describe('Project.reimport()', () => {
  describe('when the project data has not changed', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: fakeProject,
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should not emit', () => {
      project.reimport({ data: fakeProject, importId })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when the project data has changed', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: fakeProject,
            },
          }),
        ],
        appelsOffres,
      })
    )
    it('should emit ProjectReimported with the changes in the payload', () => {
      project.reimport({
        data: {
          ...fakeProject,
          prixReference: 3,
          evaluationCarbone: 4,
          details: { detail1: 'changé', detail2: 'detail2' },
        },
        importId,
      })

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectReimported.type
      ) as ProjectReimported | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.data).toMatchObject({
        prixReference: 3,
        evaluationCarbone: 4,
        details: { detail1: 'changé' },
      })
    })
  })

  describe('when the project data details field has changed', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, details: { param1: 'value1', param2: 'value2' } },
            },
          }),
        ],
        appelsOffres,
      })
    )
    it('should emit ProjectReimported with the changes in the payload', () => {
      project.reimport({
        data: {
          ...fakeProject,
          details: { param1: 'value1', param2: 'value2 changed', param3: 'value3' },
        },
        importId,
      })

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectReimported.type
      ) as ProjectReimported | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.data).toEqual({
        details: { param2: 'value2 changed', param3: 'value3' },
      })
    })
  })

  describe('when project had a previous ProjectActionnaireUpdated', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, actionnaire: 'old' },
            },
          }),
          new ProjectActionnaireUpdated({
            payload: {
              projectId: projectId.toString(),
              newActionnaire: 'new',
              updatedBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the actionnaire change', () => {
      project.reimport({
        data: {
          ...fakeProject,
          actionnaire: 'other',
        },
        importId,
      })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when project had a previous ProjectProducteurUpdated', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, nomCandidat: 'old' },
            },
          }),
          new ProjectProducteurUpdated({
            payload: {
              projectId: projectId.toString(),
              newProducteur: 'new',
              updatedBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the producteur change', () => {
      project.reimport({
        data: {
          ...fakeProject,
          nomCandidat: 'other',
        },
        importId,
      })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when project had a previous ProjectPuissanceUpdated', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, puissance: 123 },
            },
          }),
          new ProjectPuissanceUpdated({
            payload: {
              projectId: projectId.toString(),
              newPuissance: 456,
              updatedBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the puissance change', () => {
      project.reimport({
        data: {
          ...fakeProject,
          puissance: 789,
        },
        importId,
      })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when project had a previous ProjectFournisseursUpdated', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: {
                ...fakeProject,
                details: {
                  'Nom du fabricant \n(Modules ou films)': 'module1',
                  'Nom du fabricant (Cellules)': 'cellule1',
                },
              },
            },
          }),
          new ProjectFournisseursUpdated({
            payload: {
              projectId: projectId.toString(),
              newFournisseurs: [
                {
                  kind: 'Nom du fabricant \n(Modules ou films)',
                  name: 'module2',
                },
              ],
              newEvaluationCarbone: 123,
              updatedBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the change on the fournisseur that had been updated', () => {
      project.reimport({
        data: {
          ...fakeProject,
          details: {
            'Nom du fabricant \n(Modules ou films)': 'module1', // was updated by ProjectFournisseursUpdated, should be ignored
            'Nom du fabricant (Cellules)': 'cellule2', // was not updated, should be changed
          },
        },
        importId,
      })

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectReimported.type
      ) as ProjectReimported | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.data).toEqual({
        details: { 'Nom du fabricant (Cellules)': 'cellule2' },
      })
    })
  })

  describe('when project had a previous ProjectClasseGranted', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, classe: 'Eliminé' },
            },
          }),
          new ProjectClasseGranted({
            payload: {
              projectId: projectId.toString(),
              grantedBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the classe change', () => {
      project.reimport({
        data: {
          ...fakeProject,
          classe: 'Eliminé',
        },
        importId,
      })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when project had a previous ProjectNotificationDateSet', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: { ...fakeProject, notifiedOn: new Date(123).getTime() },
            },
          }),
          new ProjectNotificationDateSet({
            payload: {
              projectId: projectId.toString(),
              notifiedOn: new Date(456).getTime(),
              setBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the notification date change', () => {
      project.reimport({
        data: {
          ...fakeProject,
          notifiedOn: new Date(789).getTime(),
        },
        importId,
      })

      expect(project.pendingEvents).toHaveLength(0)
    })
  })

  describe('when project had a previous ProjectDataCorrected', () => {
    const project = UnwrapForTest(
      makeProject({
        projectId,
        history: [
          new LegacyProjectSourced({
            payload: {
              projectId: projectId.toString(),
              periodeId,
              appelOffreId,
              familleId,
              numeroCRE,
              content: {
                ...fakeProject,
                numeroCRE: '123',
                prixReference: 1,
              },
            },
          }),
          new ProjectDataCorrected({
            payload: {
              projectId: projectId.toString(),
              correctedData: {
                numeroCRE: '456',
              },
              correctedBy: '',
            },
          }),
        ],
        appelsOffres,
      })
    )

    it('should ignore the changes on the fields that were corrected', () => {
      project.reimport({
        data: {
          ...fakeProject,
          numeroCRE: '678',
          prixReference: 4,
        },
        importId,
      })

      const targetEvent = project.pendingEvents.find(
        (item) => item.type === ProjectReimported.type
      ) as ProjectReimported | undefined
      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(projectId.toString())
      expect(targetEvent.payload.data).toEqual({
        prixReference: 4,
      })
    })
  })
})
