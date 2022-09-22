import { handleModificationReceived, NotificationArgs } from '../..'
import { UniqueEntityID } from '@core/domain'
import { makeProject } from '@entities'
import routes from '@routes'
import { None, Some } from '../../../../types'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { ModificationReceived } from '../../../modificationRequest'

const userId = new UniqueEntityID().toString()
const projectId = new UniqueEntityID().toString()
const modificationRequestId = new UniqueEntityID().toString()

describe('notification.handleModificationReceived', () => {
  it(`Lorsque le projet est mis à jour, une notification devrait être envoyée au porteur à l'origine de la demande`, async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({ id: projectId, nomProjet: 'nomProjet', regionProjet: 'region' })
      ).unwrap()
    )
    const findUserById = jest.fn(async (userId: string) =>
      Some(makeFakeUser({ email: 'pp@test.test', fullName: 'john doe' }))
    )
    const findUsersForDreal = jest.fn(async (region: string) => [])

    await handleModificationReceived({
      sendNotification,
      findProjectById,
      findUserById,
      findUsersForDreal,
    })(
      new ModificationReceived({
        payload: {
          type: 'actionnaire',
          modificationRequestId,
          projectId,
          requestedBy: userId,
          actionnaire: 'test actionnaire',
          justification: 'justification',
          authority: 'dreal',
        },
      })
    )

    expect(findProjectById).toHaveBeenCalledWith(projectId)
    expect(findUserById).toHaveBeenCalledWith(userId)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notifications = sendNotification.mock.calls.map((call) => call[0])
    expect(
      notifications.every(
        (notification) =>
          notification.type === 'pp-modification-received' &&
          notification.message.email === 'pp@test.test' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'actionnaire' &&
          notification.variables.button_url === routes.USER_LIST_REQUESTS &&
          notification.variables.button_title === 'Consulter la demande' &&
          notification.variables.button_instructions ===
            `Pour la consulter, connectez-vous à Potentiel.` &&
          notification.variables.demande_action_pp === undefined &&
          notification.context.modificationRequestId === modificationRequestId &&
          notification.context.userId === userId &&
          notification.context.projectId === projectId
      )
    ).toBe(true)
  })

  it(`Lorsque le projet est mis à jour, une notification devrait être envoyée aux Dreals de la région du projet`, async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({
          id: projectId,
          nomProjet: 'nomProjet',
          regionProjet: 'regionA / regionB',
          departementProjet: 'departement',
        })
      ).unwrap()
    )
    const findUserById = jest.fn(async (userId: string) => None)
    const findUsersForDreal = jest.fn(async (region: string) =>
      region === 'regionA'
        ? [makeFakeUser({ email: 'drealA@test.test', fullName: 'drealA' })]
        : [makeFakeUser({ email: 'drealB@test.test', fullName: 'drealB' })]
    )

    await handleModificationReceived({
      sendNotification,
      findProjectById,
      findUserById,
      findUsersForDreal,
    })(
      new ModificationReceived({
        payload: {
          type: 'puissance',
          modificationRequestId,
          projectId,
          requestedBy: userId,
          puissance: 18,
          justification: 'justification',
          authority: 'dreal',
        },
      })
    )

    expect(findUsersForDreal).toHaveBeenCalledTimes(2)
    expect(findUsersForDreal).toHaveBeenCalledWith('regionA')
    expect(findUsersForDreal).toHaveBeenCalledWith('regionB')

    expect(sendNotification).toHaveBeenCalledTimes(2)
    const notifications = sendNotification.mock.calls.map((call) => call[0])

    expect(
      notifications.some(
        (notification) =>
          notification.type === 'dreal-modification-received' &&
          notification.message.email === 'drealA@test.test' &&
          notification.message.name === 'drealA' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'puissance' &&
          notification.variables.modification_request_url ===
            routes.DEMANDE_PAGE_DETAILS(modificationRequestId) &&
          notification.variables.departement_projet === 'departement' &&
          notification.context.modificationRequestId === modificationRequestId &&
          notification.context.dreal === 'regionA' &&
          notification.context.projectId === projectId
      )
    ).toBe(true)
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'dreal-modification-received' &&
          notification.message.email === 'drealB@test.test' &&
          notification.message.name === 'drealB' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'puissance' &&
          notification.variables.modification_request_url ===
            routes.DEMANDE_PAGE_DETAILS(modificationRequestId) &&
          notification.variables.departement_projet === 'departement' &&
          notification.context.modificationRequestId === modificationRequestId &&
          notification.context.dreal === 'regionB' &&
          notification.context.projectId === projectId
      )
    ).toBe(true)
  })

  describe('Lorsque le type de demande est "fournisseur"', () => {
    it(`Lorsque la nouvelle evaluationCarbone est inférieure à la valeur initiale 
        une section alerte ne devrait pas être ajoutée à la notification`, async () => {
      const sendNotification = jest.fn(async (args: NotificationArgs) => null)
      const findProjectById = jest.fn(async (region: string) =>
        makeProject(
          makeFakeProject({
            id: projectId,
            nomProjet: 'nomProjet',
            regionProjet: 'region',
            evaluationCarboneDeRéférence: 100,
          })
        ).unwrap()
      )
      const findUserById = jest.fn(async (userId: string) =>
        Some(makeFakeUser({ email: 'pp@test.test', fullName: 'john doe' }))
      )
      const findUsersForDreal = jest.fn(async (region: string) => [])

      await handleModificationReceived({
        sendNotification,
        findProjectById,
        findUserById,
        findUsersForDreal,
      })(
        new ModificationReceived({
          payload: {
            type: 'fournisseur',
            modificationRequestId,
            projectId,
            requestedBy: userId,
            fournisseurs: [{ kind: 'Nom du fabricant (Cellules)', name: 'fournisseur' }],
            evaluationCarbone: 74,
            authority: 'dreal',
          },
        })
      )

      const [notification] = sendNotification.mock.calls.map((call) => call[0])

      if (notification.type !== 'pp-modification-received') return
      expect(notification.variables.demande_action_pp).toBeUndefined()
    })

    it(`Lorsque la nouvelle evaluationCarbone est supérieure à la valeur initiale et inférieure à la tolérance
        une section alerte ne devrait pas être ajoutée à la notification`, async () => {
      const sendNotification = jest.fn(async (args: NotificationArgs) => null)
      const findProjectById = jest.fn(async (region: string) =>
        makeProject(
          makeFakeProject({
            id: projectId,
            nomProjet: 'nomProjet',
            regionProjet: 'region',
            evaluationCarboneDeRéférence: 100,
          })
        ).unwrap()
      )
      const findUserById = jest.fn(async (userId: string) =>
        Some(makeFakeUser({ email: 'pp@test.test', fullName: 'john doe' }))
      )
      const findUsersForDreal = jest.fn(async (region: string) => [])

      await handleModificationReceived({
        sendNotification,
        findProjectById,
        findUserById,
        findUsersForDreal,
      })(
        new ModificationReceived({
          payload: {
            type: 'fournisseur',
            modificationRequestId,
            projectId,
            requestedBy: userId,
            fournisseurs: [{ kind: 'Nom du fabricant (Cellules)', name: 'nom fournisseur' }],
            evaluationCarbone: 124,
            authority: 'dreal',
          },
        })
      )

      const [notification] = sendNotification.mock.calls.map((call) => call[0])

      if (notification.type !== 'pp-modification-received') return
      expect(notification.variables.demande_action_pp).toBeUndefined()
    })

    it(`Lorsque la nouvelle evaluationCarbone est supérieure à la valeur initiale et inférieur à la tolérance
        une section alerte devrait être ajoutée à la notification`, async () => {
      const sendNotification = jest.fn(async (args: NotificationArgs) => null)
      const findProjectById = jest.fn(async (region: string) =>
        makeProject(
          makeFakeProject({
            id: projectId,
            nomProjet: 'nomProjet',
            regionProjet: 'region',
            evaluationCarboneDeRéférence: 100,
          })
        ).unwrap()
      )
      const findUserById = jest.fn(async (userId: string) =>
        Some(makeFakeUser({ email: 'pp@test.test', fullName: 'john doe' }))
      )
      const findUsersForDreal = jest.fn(async (region: string) => [])

      await handleModificationReceived({
        sendNotification,
        findProjectById,
        findUserById,
        findUsersForDreal,
      })(
        new ModificationReceived({
          payload: {
            type: 'fournisseur',
            modificationRequestId,
            projectId,
            requestedBy: userId,
            fournisseurs: [{ kind: 'Nom du fabricant (Cellules)', name: 'nom fournisseur' }],
            evaluationCarbone: 125,
            authority: 'dreal',
          },
        })
      )

      const [notification] = sendNotification.mock.calls.map((call) => call[0])

      if (notification.type !== 'pp-modification-received') return
      expect(notification.variables.demande_action_pp).not.toBeUndefined()
    })
  })
})
