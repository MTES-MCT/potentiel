import { UniqueEntityID } from '@core/domain'
import {
  CahierDesChargesChoisi,
  DateMiseEnServiceRenseignée,
  NumeroGestionnaireSubmitted,
} from './events'
import { makeProject } from './Project'

describe(`Fabriquer l'aggregat projet`, () => {
  const projectId = new UniqueEntityID('le-projet')

  describe(`Cahier des charges actuel du projet`, () => {
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

  describe(`Identifiant du gestionnaire de réseau actuel du projet`, () => {
    it(`Quand on fabrique un projet sans évènement 'NumeroGestionnaireSubmitted'
      Alors l'identifiant du gestionnaire de réseau du projet devrait être vide`, () => {
      const projet = makeProject({
        projectId,
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap()

      expect(projet.identifiantGestionnaireRéseau).toEqual('')
    })

    it(`Quand on fabrique un projet avec un évènement 'NumeroGestionnaireSubmitted'
      Alors l'identifiant du gestionnaire de réseau du projet devrait être celui mentionné dans l'évènement`, () => {
      const projet = makeProject({
        projectId,
        history: [
          new NumeroGestionnaireSubmitted({
            payload: {
              projectId: projectId.toString(),
              submittedBy: 'porteur-projet',
              numeroGestionnaire: 'NUMERO-GESTIONNAIRE',
            },
          }),
        ],
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap()

      expect(projet.identifiantGestionnaireRéseau).toEqual('NUMERO-GESTIONNAIRE')
    })
  })

  describe(`Date de mise en service actuel du projet`, () => {
    it(`Quand on fabrique un projet sans évènement 'DateMiseEnServiceRenseignée'
      Alors la date de mise en service du projet devrait être undefined`, () => {
      const projet = makeProject({
        projectId,
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap()

      expect(projet.dateMiseEnService).toEqual(undefined)
    })

    it(`Quand on fabrique un projet avec évènement 'DateMiseEnServiceRenseignée'
     Alors la date de mise en service du projet devrait être celle mentionné dans l'évènement`, () => {
      const dateMiseEnService = new Date('2022-01-01').toISOString()

      const projet = makeProject({
        projectId,
        history: [
          new DateMiseEnServiceRenseignée({
            payload: {
              projetId: projectId.toString(),
              dateMiseEnService,
            },
          }),
        ],
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap()

      expect(projet.dateMiseEnService).toEqual(dateMiseEnService)
    })
  })
})
