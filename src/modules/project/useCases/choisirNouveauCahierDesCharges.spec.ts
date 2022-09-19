import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { AppelOffre, makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeChoisirNouveauCahierDesCharges } from './choisirNouveauCahierDesCharges'
import { PasDeChangementDeCDCPourCetAOError, Project, NouveauCahierDesChargesChoisi } from '..'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'

describe('Commande choisirNouveauCahierDesCharges', () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  const projectId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const projectRepo = fakeRepo({
    ...makeFakeProject(),
    nouvellesRèglesDInstructionChoisies: false,
  } as Project)

  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
      choisirNouveauCahierDesCharges: true,
    } as AppelOffre)

  beforeEach(() => {
    return publishToEventStore.mockClear()
  })

  describe(`Changement impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un utlisateur n'ayant pas les droits sur un projet
        Lorsqu'il souscrit au nouveau CDC
        Alors une erreur UnauthorizedError devrait être retournée`, async () => {
      const shouldUserAccessProject = jest.fn(async () => false)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire deux fois au même CDC`, () => {
    it(`Etant donné un utlisateur ayant les droits sur le projet
        Et le cahier des charges du 30/07/2021 choisi pour le projet
        Lorsqu'il souscrit une seconde fois au même CDC (paru le 30/07/2021)
        Alors l'utilisateur devrait être alerté qu'il est impossible de souscrire 2 fois au même CDC`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo: fakeRepo({
          ...makeFakeProject(),
          cahierDesCharges: {
            paruLe: '30/07/2021',
          },
        } as Project),
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(NouveauCahierDesChargesDéjàSouscrit)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire au nouveau CDC si l'AO n'est pas concerné`, () => {
    it(`Etant donné un utlisateur ayant les droits sur un projet
        Lorsqu'il souscrit au nouveau CDC pour un AO non concerné par ce choix
        Alors une erreur PasDeChangementDeCDCPourCetAOError devrait être retournée`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
        } as AppelOffre)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(PasDeChangementDeCDCPourCetAOError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe('Changement de CDC possible', () => {
    it(`Etant donné un utilisateur ayant les droits sur le projet
        Lorsqu'il souscrit pour la première fois à un projet dont l'AO est concerné par le choix du nouveau CDC
        Alors un événement ProjectNewRulesOptedIn devrait être émis`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NouveauCahierDesChargesChoisi.type,
          payload: expect.objectContaining({
            projetId: projectId,
            choisiPar: user.id,
            paruLe: '30/07/2021',
          }),
        })
      )
    })
  })
})
