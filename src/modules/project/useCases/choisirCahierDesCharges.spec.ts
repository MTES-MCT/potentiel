import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { UnwrapForTest } from '../../../types'
import {
  AppelOffre,
  CahierDesChargesModifié,
  CahierDesChargesRéférenceParsed,
  makeUser,
} from '@entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { makeChoisirCahierDesCharges } from './choisirCahierDesCharges'
import {
  PasDeChangementDeCDCPourCetAOError,
  CahierDesChargesChoisi,
  Project,
  NumeroGestionnaireSubmitted,
} from '..'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import {
  NouveauCahierDesChargesDéjàSouscrit,
  CahierDesChargesInitialNonDisponibleError,
  CahierDesChargesNonDisponibleError,
  IdentifiantGestionnaireRéseauObligatoireError,
} from '../errors'
import { AppelOffreRepo } from '@dataAccess'

describe('Commande choisirCahierDesCharges', () => {
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
        { type: 'modifié', paruLe: '30/07/2021', url: 'url' },
        { type: 'modifié', paruLe: '30/08/2022', url: 'url' },
        { type: 'modifié', paruLe: '30/08/2022', url: 'url', alternatif: true },
      ] as ReadonlyArray<CahierDesChargesModifié>,
    } as AppelOffre)

  beforeEach(() => {
    return publishToEventStore.mockClear()
  })

  describe(`Changement impossible si l'AO du projet n'existe pas`, () => {
    it(`Lorsqu'il souscrit à un CDC
        Alors il devrait être alerté que l'AO n'existe pas`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById: async () => undefined,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'modifié',
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Changement impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un utlisateur n'ayant pas les droits sur un projet
        Lorsqu'il souscrit à un CDC
        Alors une erreur UnauthorizedError devrait être retournée`, async () => {
      const shouldUserAccessProject = jest.fn(async () => false)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'modifié',
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire deux fois au même CDC`, () => {
    const fixtures: ReadonlyArray<{
      cdcChoisi: CahierDesChargesRéférenceParsed
      cdcActuel: CahierDesChargesRéférenceParsed
    }> = [
      {
        cdcChoisi: { type: 'modifié', paruLe: '30/07/2021' },
        cdcActuel: { type: 'modifié', paruLe: '30/07/2021' },
      },
      {
        cdcChoisi: { type: 'modifié', paruLe: '30/08/2022' },
        cdcActuel: { type: 'modifié', paruLe: '30/08/2022' },
      },
      {
        cdcChoisi: { type: 'modifié', paruLe: '30/08/2022', alternatif: true },
        cdcActuel: { type: 'modifié', paruLe: '30/08/2022', alternatif: true },
      },
    ]

    for (const { cdcActuel, cdcChoisi } of fixtures) {
      it(`Etant donné un utlisateur ayant les droits sur le projet
        Et le cahier des charges${
          cdcActuel.type === 'modifié' && cdcActuel.alternatif ? ' alternatif' : ''
        } du ${cdcActuel.type === 'modifié' && cdcActuel.paruLe} choisi pour le projet
        Lorsqu'il souscrit une seconde fois au même CDC (${
          cdcChoisi.type === 'modifié' && cdcChoisi.alternatif ? 'alternatif ' : ''
        }du ${cdcChoisi.type === 'modifié' && cdcChoisi.paruLe})
        Alors l'utilisateur devrait être alerté qu'il est impossible de souscrire 2 fois au même CDC`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const choisirCahierDesCharges = makeChoisirCahierDesCharges({
          publishToEventStore,
          shouldUserAccessProject,
          projectRepo: fakeRepo({
            ...makeFakeProject(),
            cahierDesCharges: cdcActuel,
          } as Project),
          findAppelOffreById,
        })

        const res = await choisirCahierDesCharges({
          projetId: projectId,
          utilisateur: user,
          cahierDesCharges: cdcChoisi,
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(NouveauCahierDesChargesDéjàSouscrit)
        expect(publishToEventStore).not.toHaveBeenCalled()
      })
    }
  })

  describe(`Impossible de souscrire à un CDC si l'AO n'a pas de CDC modifiés disponible`, () => {
    it(`Etant donné un utilisateur ayant les droits sur un projet
        Et l'AO sans CDC modifié disponible
        Lorsqu'il souscrit à un CDC
        Alors l'utilisateur devrait être alerté que l'AO ne dispose pas de CDC modifiés disponible`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
          choisirNouveauCahierDesCharges: true,
          cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
        } as AppelOffre)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'modifié',
          paruLe: '30/07/2021',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(PasDeChangementDeCDCPourCetAOError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire à un CDC si celui-ci n'existe pas dans les CDC modifiés disponible de l'AO`, () => {
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
            { type: 'modifié', paruLe: '30/08/2022', url: 'url' },
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as AppelOffre)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'modifié',
          paruLe: '30/08/2022',
          alternatif: true,
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(CahierDesChargesNonDisponibleError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire à un CDC sans identifiant gestionnaire réseau si le CDC en requiert un`, () => {
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
            { type: 'modifié', paruLe: '30/08/2022', url: 'url', numéroGestionnaireRequis: true },
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as AppelOffre)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'modifié',
          paruLe: '30/08/2022',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(IdentifiantGestionnaireRéseauObligatoireError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Impossible de souscrire au CDC initial si l'AO ne permet pas de faire ce choix`, () => {
    it(`Etant donné un utilisateur ayant les droits sur un projet
        Et une AO ne permettant pas de choisir le CDC initial 
        Lorsqu'il souscrit au CDC initial
        Alors l'utilisateur devrait être alerté que l'AO ne permet pas de choisir ce cahier des charges`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        cahierDesCharges: {
          paruLe: '30/08/2022',
        },
      } as Project)
      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
          choisirNouveauCahierDesCharges: true,
          cahiersDesChargesModifiésDisponibles: [
            { type: 'modifié', paruLe: '30/08/2022', url: 'url', numéroGestionnaireRequis: true },
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as AppelOffre)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'initial',
        },
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(CahierDesChargesInitialNonDisponibleError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Choix d'un CDC modifié`, () => {
    const fixtures: ReadonlyArray<{
      cdcActuel: CahierDesChargesRéférenceParsed
      cdcChoisi: CahierDesChargesRéférenceParsed
      cdcAttendu: CahierDesChargesRéférenceParsed
    }> = [
      {
        cdcActuel: { type: 'initial' },
        cdcChoisi: { type: 'modifié', paruLe: '30/07/2021' },
        cdcAttendu: { type: 'modifié', paruLe: '30/07/2021' },
      },
      {
        cdcActuel: { type: 'modifié', paruLe: '30/07/2021' },
        cdcChoisi: { type: 'modifié', paruLe: '30/08/2022' },
        cdcAttendu: { type: 'modifié', paruLe: '30/08/2022' },
      },
      {
        cdcActuel: { type: 'modifié', paruLe: '30/08/2022' },
        cdcChoisi: { type: 'modifié', paruLe: '30/08/2022', alternatif: true },
        cdcAttendu: { type: 'modifié', paruLe: '30/08/2022', alternatif: true },
      },
    ]

    for (const { cdcActuel, cdcChoisi, cdcAttendu } of fixtures) {
      it(`Etant donné un utilisateur ayant les droits sur le projet
          Et le cahier des charges${
            cdcActuel.type === 'modifié' && cdcActuel.alternatif ? ' alternatif' : ''
          } du ${cdcActuel.type === 'modifié' && cdcActuel.paruLe} choisi pour le projet
          Et l'AO avec les CDC modifiés disponibles suivant :
            | paru le 30/07/2021
            | paru le 30/08/2022
            | alternatif paru le 30/08/2022
          Lorsqu'il souscrit au CDC${
            cdcChoisi.type === 'modifié' && cdcChoisi.alternatif ? ' alternatif' : ''
          } paru le ${cdcChoisi.type === 'modifié' && cdcChoisi.paruLe}
          Alors le CDC du projet devrait être ${
            cdcChoisi.type === 'modifié' && cdcChoisi.alternatif ? `l'alternatif` : 'celui'
          } paru le ${cdcAttendu.type === 'modifié' && cdcAttendu.paruLe}`, async () => {
        const shouldUserAccessProject = jest.fn(async () => true)

        const choisirCahierDesCharges = makeChoisirCahierDesCharges({
          publishToEventStore,
          shouldUserAccessProject,
          projectRepo: fakeRepo({
            ...makeFakeProject(),
            cahierDesCharges: cdcActuel,
          } as Project),
          findAppelOffreById,
        })

        const res = await choisirCahierDesCharges({
          projetId: projectId,
          utilisateur: user,
          cahierDesCharges: cdcChoisi,
        })

        expect(res.isOk()).toBe(true)

        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: CahierDesChargesChoisi.type,
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
      } as Project

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo: fakeRepo(projet),
        findAppelOffreById: async () =>
          ({
            id: 'appelOffreId',
            periodes: [{ id: 'periodeId', type: 'notified' }],
            familles: [{ id: 'familleId' }],
            cahiersDesChargesModifiésDisponibles: [
              { type: 'modifié', paruLe: '30/07/2021', url: 'url' },
              { type: 'modifié', paruLe: '30/08/2022', url: 'url', numéroGestionnaireRequis: true },
            ] as ReadonlyArray<CahierDesChargesModifié>,
          } as AppelOffre),
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
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
          type: CahierDesChargesChoisi.type,
          payload: expect.objectContaining({
            projetId: projectId,
            choisiPar: user.id,
            paruLe: '30/08/2022',
            type: 'modifié',
          }),
        })
      )
    })
  })

  describe(`Choix du CDC initial si l'AO le permet`, () => {
    it(`Etant donné un utilisateur ayant les droits sur le projet
        Et le cahier des charges du 30/08/2022 choisi pour le projet
        Et une AO permettant de choisir le CDC initial
        Lorsqu'il souscrit au CDC initial
        Alors le CDC du projet devrait être 'initial'`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      const projectRepo = fakeRepo({
        ...makeFakeProject(),
        cahierDesCharges: {
          paruLe: '30/08/2022',
        },
      } as Project)
      const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
        ({
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', type: 'notified' }],
          familles: [{ id: 'familleId' }],
          choisirNouveauCahierDesCharges: true,
          doitPouvoirChoisirCDCInitial: true,
          cahiersDesChargesModifiésDisponibles: [
            { type: 'modifié', paruLe: '30/08/2022', url: 'url', numéroGestionnaireRequis: true },
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as AppelOffre)

      const choisirCahierDesCharges = makeChoisirCahierDesCharges({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        findAppelOffreById,
      })

      const res = await choisirCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: {
          type: 'initial',
        },
      })

      expect(res.isOk()).toBe(true)
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: CahierDesChargesChoisi.type,
          payload: expect.objectContaining({
            projetId: projectId,
            choisiPar: user.id,
            type: 'initial',
          }),
        })
      )
    })
  })
})
