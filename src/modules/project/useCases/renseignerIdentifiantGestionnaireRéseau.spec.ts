import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError } from '../../shared'
import { Project, NumeroGestionnaireSubmitted } from '..'
import { fakeRepo } from '../../../__tests__/fixtures/aggregates'
import makeFakeProject from '../../../__tests__/fixtures/project'
import { IdentifiantGestionnaireRéseauExistantError } from '../errors'
import { makeRenseignerIdentifiantGestionnaireRéseau } from './renseignerIdentifiantGestionnaireRéseau'

describe(`Renseigner l'identifiant gestionnaire de réseau`, () => {
  const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
  const projetId = new UniqueEntityID().toString()
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null))
  const projectRepo = fakeRepo({
    ...makeFakeProject(),
    id: projetId,
  } as Project)

  beforeEach(() => {
    return publishToEventStore.mockClear()
  })

  describe(`Impossible de renseigner un identifiant gestionnaire réseau déjà existant pour un autre projet`, () => {
    it(`Etant donné un utilisateur ayant les droits sur le projet
        Et un autre projet avec l'identifiant gestionnaire réseau 'ID_GES_RES'
        Lorsqu'il renseigne l'identifiant gestionnaire réseau 'ID_GES_RES'
        Alors l'utilisateur devrait être informé que l'identifiant est déjà utilisé pour un autre projet `, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const renseignerIdentifiantGestionnaireRéseau = makeRenseignerIdentifiantGestionnaireRéseau({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        trouverProjetsParIdentifiantGestionnaireRéseau: () => okAsync(['un-autre-projet']),
      })

      const résulat = await renseignerIdentifiantGestionnaireRéseau({
        projetId: projetId,
        utilisateur: user,
        identifiantGestionnaireRéseau: 'ID_GES_RES',
      })

      expect(résulat._unsafeUnwrapErr()).toBeInstanceOf(IdentifiantGestionnaireRéseauExistantError)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Ne pas renseigner l'identifiant gestionnaire réseau si identique dans le projet`, () => {
    it(`Etant donné un utilisateur ayant les droits sur le projet
        Et le projet avec comme identifiant gestionnaire de réseau 'ID_GES_RES'
        Lorsqu'il renseigne l'identifiant gestionnaire réseau 'ID_GES_RES'
        Alors aucune modification n'est apportée au projet`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const projet = {
        ...makeFakeProject(),
        identifiantGestionnaireRéseau: 'ID_GES_RES',
      } as Project

      const renseignerIdentifiantGestionnaireRéseau = makeRenseignerIdentifiantGestionnaireRéseau({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo: fakeRepo(projet),
        trouverProjetsParIdentifiantGestionnaireRéseau: () => okAsync([projetId]),
      })

      const résulat = await renseignerIdentifiantGestionnaireRéseau({
        projetId: projetId,
        utilisateur: user,
        identifiantGestionnaireRéseau: 'ID_GES_RES',
      })
      expect(résulat.isOk()).toBe(true)
      expect(publishToEventStore).not.toHaveBeenCalled()
    })
  })

  describe(`Renseigner l'identifiant gestionnaire réseau`, () => {
    it(`Etant donné un utilisateur ayant les droits sur le projet
        Lorsqu'il renseigne l'identifiant gestionnaire réseau 'ID_GES_RES'
        Alors l'identifiant gestionnaire réseau du projet devrait être 'ID_GES_RES' pour le projet`, async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      const renseignerIdentifiantGestionnaireRéseau = makeRenseignerIdentifiantGestionnaireRéseau({
        publishToEventStore,
        shouldUserAccessProject,
        projectRepo,
        trouverProjetsParIdentifiantGestionnaireRéseau: () => okAsync([]),
      })

      const résulat = await renseignerIdentifiantGestionnaireRéseau({
        projetId: projetId,
        utilisateur: user,
        identifiantGestionnaireRéseau: 'ID_GES_RES',
      })

      expect(résulat.isOk()).toBe(true)

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NumeroGestionnaireSubmitted.type,
          payload: expect.objectContaining({
            projectId: projetId,
            numeroGestionnaire: 'ID_GES_RES',
            submittedBy: user.id,
          }),
        })
      )
    })
  })
})
