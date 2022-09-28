import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import { AppelOffre, CahierDesChargesModifié, makeUser } from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeChoisirNouveauCahierDesCharges } from './choisirNouveauCahierDesCharges'
import {
  PasDeChangementDeCDCPourCetAOError,
  Project,
  NouveauCahierDesChargesChoisi,
  NumeroGestionnaireSubmitted,
} from '..'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import {
  NouveauCahierDesChargesDéjàSouscrit,
  CahierDesChargesNonDisponibleError,
  IdentifiantGestionnaireRéseauObligatoireError,
} from '../errors'
import { AppelOffreRepo } from '@dataAccess'

describe('Commande choisirNouveauCahierDesCharges', () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  const projectId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const projectRepo = fakeRepo({
    ...makeFakeProject(),
    cahierDesCharges: {
      paruLe: 'initial',
    },
  } as Project)

  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
      cahiersDesChargesModifiésDisponibles: [
        { paruLe: '30/07/2021', url: 'url' },
        { paruLe: '30/08/2022', url: 'url' },
        { paruLe: '30/08/2022', url: 'url', alternatif: true },
      ] as ReadonlyArray<CahierDesChargesModifié>,
    } as AppelOffre)

  beforeEach(() => {
    return publishToEventStore.mockClear()
  })

  describe(`Changement impossible si l'AO du projet n'existe pas`, () => {
    it(`Lorsqu'il souscrit à un nouveau CDC
        Alors il devrait être alerté que l'AO n'existe pas`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById: async () => undefined,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Changement impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un utlisateur n'ayant pas les droits sur un projet
        Lorsqu'il souscrit à un nouveau CDC
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
        cahierDesCharges: {
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire deux fois au même CDC`, () => {
    type CahierDesCharges = { paruLe: '30/07/2021' | '30/08/2022'; alternatif?: true }
    const fixtures: ReadonlyArray<{ cdcChoisi: CahierDesCharges; cdcActuel: CahierDesCharges }> = [
      { cdcChoisi: { paruLe: '30/07/2021' }, cdcActuel: { paruLe: '30/07/2021' } },
      { cdcChoisi: { paruLe: '30/08/2022' }, cdcActuel: { paruLe: '30/08/2022' } },
      {
        cdcChoisi: { paruLe: '30/08/2022', alternatif: true },
        cdcActuel: { paruLe: '30/08/2022', alternatif: true },
      },
    ]

    for (const { cdcActuel, cdcChoisi } of fixtures) {
      it(`Etant donné un utlisateur ayant les droits sur le projet
        Et le cahier des charges${cdcActuel.alternatif ? ' alternatif' : ''} du ${
        cdcActuel.paruLe
      } choisi pour le projet
        Lorsqu'il souscrit une seconde fois au même CDC (${
          cdcChoisi.alternatif ? 'alternatif ' : ''
        }du ${cdcChoisi.paruLe})
        Alors l'utilisateur devrait être alerté qu'il est impossible de souscrire 2 fois au même CDC`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
          publishToEventStore,
          shouldUserAccessProject,
          projectRepo: fakeRepo({
            ...makeFakeProject(),
            cahierDesCharges: cdcActuel,
          } as unknown as Project),
          findAppelOffreById,
        })

        const res = await choisirNouveauCahierDesCharges({
          projetId: projectId,
          utilisateur: user,
          cahierDesCharges: cdcChoisi,
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(NouveauCahierDesChargesDéjàSouscrit)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    }
  })

  describe(`Impossible de souscrire à un nouveau CDC si l'AO n'a pas de CDC modifiés disponible`, () => {
    it(`Etant donné un utilisateur ayant les droits sur un projet
        Et l'AO sans CDC modifié disponible
        Lorsqu'il souscrit à un nouveau CDC
        Alors l'utilisateur devrait être alerté que l'AO ne dispose pas de CDC modifiés disponible`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
          choisirNouveauCahierDesCharges: true,
          cahiersDesChargesModifiésDisponibles:
            [] as unknown as ReadonlyArray<CahierDesChargesModifié>,
        } as unknown as AppelOffre)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(PasDeChangementDeCDCPourCetAOError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire à un nouveau CDC si celui-ci n'existe pas dans les CDC modifiés disponible de l'AO`, () => {
    it(`Etant donné un utilisateur ayant les droits sur un projet
        Et l'AO avec un CDC modifié paru le 30/08/2022
        Lorsqu'il souscrit au CDC alternatif paru le 30/08/2022
        Alors l'utilisateur devrait être alerté que le CDC choisi n'est pas disponible pour l'AO`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
          choisirNouveauCahierDesCharges: true,
          cahiersDesChargesModifiésDisponibles: [
            { paruLe: '30/08/2022', url: 'url' },
          ] as unknown as ReadonlyArray<CahierDesChargesModifié>,
        } as unknown as AppelOffre)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          paruLe: '30/08/2022',
          alternatif: true,
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(CahierDesChargesNonDisponibleError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire à un nouveau CDC sans identifiant gestionnaire réseau si le CDC en requiert un`, () => {
    it(`Etant donné un utilisateur ayant les droits sur un projet
        Et l'AO avec un CDC modifié paru le 30/08/2022 qui requiert un identifiant gestionnaire réseau
        Lorsqu'il souscrit au CDC alternatif paru le 30/08/2022 sans identifiant gestionnaire réseau
        Alors l'utilisateur devrait être alerté que l'identifiant gestionnaire réseau est obligatoire pour ce CDC '`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
          choisirNouveauCahierDesCharges: true,
          cahiersDesChargesModifiésDisponibles: [
            { paruLe: '30/08/2022', url: 'url', numéroGestionnaireRequis: true },
          ] as unknown as ReadonlyArray<CahierDesChargesModifié>,
        } as unknown as AppelOffre)

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          paruLe: '30/08/2022',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(IdentifiantGestionnaireRéseauObligatoireError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Choix d'un CDC modifié`, () => {
    type CahierDesCharges = { paruLe: '30/07/2021' | '30/08/2022'; alternatif?: true }
    const fixtures: ReadonlyArray<{
      cdcActuel: CahierDesCharges | { paruLe: 'initial'; alternatif?: undefined }
      cdcChoisi: CahierDesCharges
      cdcAttendu: CahierDesCharges
    }> = [
      {
        cdcActuel: { paruLe: 'initial' },
        cdcChoisi: { paruLe: '30/07/2021' },
        cdcAttendu: { paruLe: '30/07/2021' },
      },
      {
        cdcActuel: { paruLe: '30/07/2021' },
        cdcChoisi: { paruLe: '30/08/2022' },
        cdcAttendu: { paruLe: '30/08/2022' },
      },
      {
        cdcActuel: { paruLe: '30/08/2022' },
        cdcChoisi: { paruLe: '30/08/2022', alternatif: true },
        cdcAttendu: { paruLe: '30/08/2022', alternatif: true },
      },
    ]

    for (const { cdcActuel, cdcChoisi, cdcAttendu } of fixtures) {
      it(`Etant donné un utilisateur ayant les droits sur le projet
          Et le cahier des charges${cdcActuel.alternatif ? ' alternatif' : ''} du ${
        cdcActuel.paruLe
      } choisi pour le projet
          Et l'AO avec les CDC modifiés disponibles suivant :
            | paru le 30/07/2021
            | paru le 30/08/2022 
            | alternatif paru le 30/08/2022 
          Lorsqu'il souscrit au CDC${cdcChoisi.alternatif ? ' alternatif' : ''} paru le ${
        cdcChoisi.paruLe
      }
          Alors le CDC du projet devrait être ${
            cdcChoisi.alternatif ? `l'alternatif` : 'celui'
          } paru le ${cdcAttendu.paruLe}`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
          publishToEventStore,
          shouldUserAccessProject,
          projectRepo: fakeRepo({
            ...makeFakeProject(),
            cahierDesCharges: cdcActuel,
          } as Project),
          findAppelOffreById,
        })

        const res = await choisirNouveauCahierDesCharges({
          projetId: projectId,
          utilisateur: user,
          cahierDesCharges: cdcChoisi,
        })

        expect(res.isOk()).toBe(true)

        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: NouveauCahierDesChargesChoisi.type,
            payload: expect.objectContaining({
              projetId: projectId,
              choisiPar: user.id,
              ...cdcAttendu,
            }),
          })
        )
      })
    }
  })

  describe(`CDC avec identifiant gestionnaire réseau obligatoire`, () => {
    it(`Etant donné un utilisateur ayant les droits sur le projet
          Et le cahier des charges du 30/07/2021 choisi pour le projet
          Et l'AO avec les CDC modifiés disponibles suivant :
            | paru le 30/07/2021
            | paru le 30/08/2022 requiérant l'identifiant gestionnaire réseau 
          Lorsqu'il souscrit au CDC paru le 30/08/2022 avec l'identifiant gestionnaire réseau 'ID_GES_RES'
          Alors l'identifiant gestionnaire réseau du projet devrait être 'ID_GES_RES'`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const projet = {
        ...makeFakeProject(),
        cahierDesCharges: { paruLe: '30/07/2021' },
      } as unknown as Project

      const choisirNouveauCahierDesCharges = makeChoisirNouveauCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo: fakeRepo(projet),
        findAppelOffreById: async () =>
          ({
            id: 'appelOffreId',
            periodes: [{ id: 'periodeId', type: 'notified' }],
            familles: [{ id: 'familleId' }],
            cahiersDesChargesModifiésDisponibles: [
              { paruLe: '30/07/2021', url: 'url' },
              { paruLe: '30/08/2022', url: 'url', numéroGestionnaireRequis: true },
            ] as unknown as ReadonlyArray<CahierDesChargesModifié>,
          } as unknown as AppelOffre),
      })

      const res = await choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: { paruLe: '30/08/2022' },
        identifiantGestionnaireRéseau: 'ID_GES_RES',
      })

      expect(res.isOk()).toBe(true)

      expect(publishToEventStore).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: NumeroGestionnaireSubmitted.type,
          payload: expect.objectContaining({
            projectId,
            numeroGestionnaire: 'ID_GES_RES',
            submittedBy: user.id,
          }),
        })
      )
      expect(publishToEventStore).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: NouveauCahierDesChargesChoisi.type,
          payload: expect.objectContaining({
            projetId: projectId,
            choisiPar: user.id,
            paruLe: '30/08/2022',
          }),
        })
      )
    })
  })
})
