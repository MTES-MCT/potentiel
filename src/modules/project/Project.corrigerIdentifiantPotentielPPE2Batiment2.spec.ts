import { UnwrapForTest } from '@core/utils'
import { UniqueEntityID } from '@core/domain'
import { IdentifiantPotentielPPE2Batiment2Corrigé, ProjectImported } from './events'
import { makeProject } from './Project'
import makeFakeProject from '../../__tests__/fixtures/project'
import { ProjectAppelOffre } from '@entities'

/* 
Fonctionnalité : Modifier l'identifiant Potentiel d'un projet PPE2 Bâtiment période 2
*/

const getProjectAppelOffre = ({ appelOffreId, periodeId, familleId }) => {
  return {
    id: appelOffreId,
    periode: { id: periodeId },
    ...(familleId && { famille: { id: familleId } }),
  } as ProjectAppelOffre
}

// Scénario
describe(`Modifier l'identifiant Potentiel d'un projet`, () => {
  describe(`Étant donné un projet PPE2 - Bâtiment période 2 avec un identifiant erroné`, () => {
    const projectData = makeFakeProject({
      appelOffreId: 'PPE2 - Bâtiment',
    })

    const project = UnwrapForTest(
      makeProject({
        projectId: new UniqueEntityID('project-1'),
        history: [
          new ProjectImported({
            payload: {
              projectId: 'project-1',
              periodeId: '2',
              familleId: '',
              numeroCRE: 'CRE',
              potentielIdentifier: 'PPE2 - Bâtiment 2-P2-0-aaa', // le '2' derrière bâtiment doit être retiré
              importId: 'import-1',
              appelOffreId: 'PPE2 - Bâtiment',
              data: projectData,
            },
          }),
        ],
        getProjectAppelOffre,
        buildProjectIdentifier: () => '',
      })
    )
    describe(`Quand on corrige l'identifiant Potentiel`, () => {
      project.corrigerIdentifiantPotentielPPE2Batiment2()

      it(`Alors l'événement "IdentifiantPotentielPPE2Batiment2Corrigé" doit être émis avec le nouvel identifiant`, () => {
        const actualEvent = project.pendingEvents.find(
          (e) => e.type === 'IdentifiantPotentielPPE2Batiment2Corrigé'
        ) as IdentifiantPotentielPPE2Batiment2Corrigé

        expect(actualEvent).toBeDefined()
        expect(actualEvent?.payload).toStrictEqual({
          projectId: 'project-1',
          nouvelIdentifiant: 'PPE2 - Bâtiment-P2-0-aaa',
        })
      })
    })
  })
})
