import { UnwrapForTest } from '@core/utils'
import { UniqueEntityID } from '@core/domain'
import { AppelOffreProjetModifié, ProjectImported } from './events'
import { makeProject } from './Project'
import makeFakeProject from '../../__tests__/fixtures/project'
import { AppelOffre, ProjectAppelOffre } from '@entities'

/* 
Fonctionnalité : Modifier l'appel d'offre d'un projet

    Afin de corriger un projet avec un appel d'offre incorrect ou ayant changé d'identifiant
    On souhaite pouvoir modifier l'appel d'offre du projet
*/

const getProjectAppelOffre = ({ appelOffreId, periodeId, familleId }) => {
  return {
    id: appelOffreId,
    periode: { id: periodeId },
    ...(familleId && { famille: { id: familleId } }),
  } as ProjectAppelOffre
}

// Scénario
describe(`Modifier l'AO d'un projet`, () => {
  describe(`Étant donné un projet importé avec l'AO "PPE2 - Batiment 2"`, () => {
    const projectData = makeFakeProject({
      appelOffreId: 'PPE2 - Batiment 2',
    })

    const project = UnwrapForTest(
      makeProject({
        projectId: new UniqueEntityID('project-1'),
        history: [
          new ProjectImported({
            payload: {
              projectId: 'project-1',
              periodeId: 'periode-1',
              familleId: 'famille-1',
              numeroCRE: 'numero-cre',
              potentielIdentifier: 'potentielid-project-1',
              importId: 'import-1',
              appelOffreId: 'PPE2 - Batiment 2',
              data: projectData,
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )
    describe(`Quand on modifie l'AO du projet par "PPE2 - Batiment"`, () => {
      project.modifierAppelOffre({ id: 'PPE2 - Batiment' } as AppelOffre)

      it(`Alors l'événement "AppelOffreProjetModifié" doit être émis avec le nouvel AO`, () => {
        const actualEvent = project.pendingEvents.find((e) => e.type === 'AppelOffreProjetModifié')

        expect(actualEvent).toBeDefined()
        expect(actualEvent?.payload).toStrictEqual({
          projectId: 'project-1',
          appelOffreId: 'PPE2 - Batiment',
        })
      })

      it(`Et l'AO du projet doit être "PPE2 - Batiment"`, () => {
        expect(project.appelOffre?.id).toBe('PPE2 - Batiment')
      })
    })
  })
})

// Scénario
describe(`Charger un projet avec un AO modifié`, () => {
  describe(`
        Étant donné un projet importé avec l'AO "PPE2 - Batiment 2"
        Et avec son AO modifié par "PPE2 - Batiment"
        Quand on charge le projet`, () => {
    const projectData = makeFakeProject({
      appelOffreId: 'PPE2 - Batiment 2',
    })

    const project = UnwrapForTest(
      makeProject({
        projectId: new UniqueEntityID('project-1'),
        history: [
          new ProjectImported({
            payload: {
              projectId: 'project-1',
              periodeId: 'periode-1',
              familleId: 'famille-1',
              numeroCRE: 'numero-cre',
              potentielIdentifier: 'potentielid-project-1',
              importId: 'import-1',
              appelOffreId: 'PPE2 - Batiment 2',
              data: projectData,
            },
          }),
          new AppelOffreProjetModifié({
            payload: {
              projectId: 'project-1',
              appelOffreId: 'PPE2 - Batiment',
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )
    it(`Alors l'AO du projet doit être "PPE2 - Batiment"`, () => {
      expect(project.appelOffre?.id).toBe('PPE2 - Batiment')
    })
  })
})

// Scénario
describe(`Modifier l'AO d'un projet avec le même`, () => {
  describe(`Étant donné un projet importé avec l'AO "PPE2 - Batiment"`, () => {
    const projectData = makeFakeProject({
      appelOffreId: 'PPE2 - Batiment',
    })

    const project = UnwrapForTest(
      makeProject({
        projectId: new UniqueEntityID('project-1'),
        history: [
          new ProjectImported({
            payload: {
              projectId: 'project-1',
              periodeId: 'periode-1',
              familleId: 'famille-1',
              numeroCRE: 'numero-cre',
              potentielIdentifier: 'potentielid-project-1',
              importId: 'import-1',
              appelOffreId: 'PPE2 - Batiment',
              data: projectData,
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )
    describe(`Quand on modifie l'AO du projet par "PPE2 - Batiment"`, () => {
      project.modifierAppelOffre({ id: 'PPE2 - Batiment' } as AppelOffre)

      it(`Alors aucun évennement ne doit être émis`, () => {
        expect(project.pendingEvents).toHaveLength(0)
      })

      it(`Et l'AO du projet doit toujours être "PPE2 - Batiment"`, () => {
        expect(project.appelOffre?.id).toBe('PPE2 - Batiment')
      })
    })
  })
})
