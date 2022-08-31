import { DomainEvent, EventBus, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { AppelOffre, makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeChoisirNouveauCahierDesCharges } from './choisirNouveauCahierDesCharges'
import { PasDeChangementDeCDCPourCetAOError, Project, ProjectNewRulesOptedIn } from '..'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'

describe('Commande choisirNouveauCahierDesCharges', () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
  const projectId = new UniqueEntityID().toString()

  const fakeEventBus: EventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  }

  const projectRepo = fakeRepo({ ...makeFakeProject(), newRulesOptIn: false } as Project)

  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
      choisirNouveauCahierDesCharges: true,
    } as AppelOffre)

  beforeEach(() => {
    return fakePublish.mockClear()
  })

  describe(`Changement impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un utlisateur n'ayant pas les droits sur un projet`, () => {
      it(`Lorsqu'il souscrit au nouveau CDC,
        alors une erreur UnauthorizedError devrait être retournée`, async () => {
        const shouldUserAccessProject = jest.fn(async () => false)

        const updateNewRulesOptIn = makeChoisirNouveauCahierDesCharges({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
          projectRepo,
          findAppelOffreById,
        })

        const res = await updateNewRulesOptIn({
          projetId: projectId,
          utilisateur: user,
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
        expect(fakePublish).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Impossible de souscrire deux fois au CDC`, () => {
    describe(`Etant donné un utlisateur ayant les droits sur un projet`, () => {
      it(`Lorsqu'il souscrit une seconde dois au nouveau CDC, 
      alors une erreur NouveauCahierDesChargesDéjàSouscrit devrait être retournée`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const updateNewRulesOptIn = makeChoisirNouveauCahierDesCharges({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
          projectRepo: fakeRepo({ ...makeFakeProject(), newRulesOptIn: true } as Project),
          findAppelOffreById,
        })

        const res = await updateNewRulesOptIn({
          projetId: projectId,
          utilisateur: user,
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(NouveauCahierDesChargesDéjàSouscrit)
        expect(fakePublish).not.toHaveBeenCalled()
      })
    })
  })

  describe(`Impossible de souscrire au nouveau CDC si l'AO n'est pas concerné`, () => {
    describe(`Etant donné un utlisateur ayant les droits sur un projet`, () => {
      it(`Lorsqu'il souscrit au nouveau CDC pour un AO non concerné par ce choix, 
      alors une erreur PasDeChangementDeCDCPourCetAOError devrait être retournée`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
          ({
            id: 'appelOffreId',
            periodes: [{ id: 'periodeId', type: 'notified' }],
            familles: [{ id: 'familleId' }],
          } as AppelOffre)

        const updateNewRulesOptIn = makeChoisirNouveauCahierDesCharges({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
          projectRepo,
          findAppelOffreById,
        })

        const res = await updateNewRulesOptIn({
          projetId: projectId,
          utilisateur: user,
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(PasDeChangementDeCDCPourCetAOError)
        expect(fakePublish).not.toHaveBeenCalled()
      })
    })
  })

  describe('Changement de CDC possible', () => {
    describe(`Etant donné un utilisateur ayant les droits sur le projet`, () => {
      it(`Lorsqu'il souscrit pour la première fois à un projet dont l'AO est concerné par le choix du nouveau CDC,
      alors un événement ProjectNewRulesOptedIn devrait être émis`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const updateNewRulesOptIn = makeChoisirNouveauCahierDesCharges({
          eventBus: fakeEventBus,
          shouldUserAccessProject,
          projectRepo,
          findAppelOffreById,
        })

        const res = await updateNewRulesOptIn({
          projetId: projectId,
          utilisateur: user,
        })

        expect(res.isOk()).toBe(true)

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId,
        })

        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectNewRulesOptedIn.type) as ProjectNewRulesOptedIn

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId)
      })
    })
  })
})
