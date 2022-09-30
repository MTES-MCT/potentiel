import { UniqueEntityID } from '@core/domain'
import { CahierDesChargesChoisi } from './events'
import { makeProject } from './Project'

describe(`Fabriquer l'aggregat projet`, () => {
  const projectId = new UniqueEntityID('le-projet')

  it(`Quand on fabrique un projet sans évènement 'CahierDesChargesChoisi'
      Alors le cahier des charges du projet devrait être celui en vigeur à la candidature`, () => {
    const projet = makeProject({
      projectId,
      getProjectAppelOffre: jest.fn(),
      buildProjectIdentifier: jest.fn(),
    })._unsafeUnwrap()

    expect(projet.cahierDesCharges).toEqual({
      type: 'initial',
    })
  })

  it(`Quand on fabrique un projet avec un évènement 'CahierDesChargesChoisi'
      Alors le projet a un CDC correspondant à celui mentionné dans l'évènement`, () => {
    const projet = makeProject({
      projectId,
      history: [
        new CahierDesChargesChoisi({
          payload: {
            projetId: projectId.toString(),
            choisiPar: 'porteur-projet',
            type: 'modifié',
            paruLe: '30/07/2021',
            alternatif: true,
          },
        }),
      ],
      getProjectAppelOffre: jest.fn(),
      buildProjectIdentifier: jest.fn(),
    })._unsafeUnwrap()

    expect(projet.cahierDesCharges).toEqual({
      type: 'modifié',
      paruLe: '30/07/2021',
      alternatif: true,
    })
  })
})
