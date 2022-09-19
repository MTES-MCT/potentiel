import { UniqueEntityID } from '@core/domain'
import { NouveauCahierDesChargesChoisi } from './events'
import { makeProject } from './Project'

describe(`Fabriquer l'aggregat projet`, () => {
  const projectId = new UniqueEntityID('le-projet')

  it(`Quand on fabrique un projet sans évènement 'NouveauCahierDesChargesChoisi'
      Alors le cahier des charges du projet devrait être celui en vigeur à la candidature`, () => {
    const projet = makeProject({
      projectId,
      getProjectAppelOffre: jest.fn(),
      buildProjectIdentifier: jest.fn(),
    })._unsafeUnwrap()

    expect(projet.cahierDesCharges).toEqual({
      paruLe: 'initial',
    })
  })

  it(`Quand on fabrique un projet avec un évènement 'NouveauCahierDesChargesChoisi'
      Alors le projet a un CDC correspondant à celui mentionné dans l'évènement`, () => {
    const projet = makeProject({
      projectId,
      history: [
        new NouveauCahierDesChargesChoisi({
          payload: {
            projetId: projectId.toString(),
            choisiPar: 'porteur-projet',
            paruLe: '30/07/2021',
          },
        }),
      ],
      getProjectAppelOffre: jest.fn(),
      buildProjectIdentifier: jest.fn(),
    })._unsafeUnwrap()

    expect(projet.cahierDesCharges).toEqual({
      paruLe: '30/07/2021',
    })
  })
})
