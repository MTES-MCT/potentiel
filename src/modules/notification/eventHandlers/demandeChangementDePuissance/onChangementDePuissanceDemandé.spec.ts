import { NotificationArgs, onChangementDePuissanceDemandé } from '../..'
import { UniqueEntityID } from '@core/domain'
import { makeProject } from '@entities'
import routes from '@routes'
import { None, Some } from '../../../../types'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification'

const demandeId = new UniqueEntityID().toString()
const projetId = new UniqueEntityID().toString()
const userId = new UniqueEntityID().toString()

describe('notification.onChangementDePuissanceDemandé', () => {
  it(`Lorsque le projet est mis à jour, une notification devrait être envoyée au porteur à l'origine de la demande`, async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({ id: projetId, nomProjet: 'nomProjet', regionProjet: 'region' })
      ).unwrap()
    )
    const findUserById = jest.fn(async (userId: string) =>
      Some(makeFakeUser({ email: 'pp@test.test', fullName: 'john doe' }))
    )
    const findUsersForDreal = jest.fn(async (region: string) => [])

    await onChangementDePuissanceDemandé({
      sendNotification,
      findProjectById,
      findUserById,
      findUsersForDreal,
    })(
      new ChangementDePuissanceDemandé({
        payload: {
          demandeId,
          projetId,
          demandéPar: userId,
          justification: 'justification',
          autorité: 'dreal',
          puissance: 2,
        },
      })
    )

    expect(findProjectById).toHaveBeenCalledWith(projetId)
    expect(findUserById).toHaveBeenCalledWith(userId)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notifications = sendNotification.mock.calls.map((call) => call[0])
    expect(
      notifications.every(
        (notification) =>
          notification.type === 'pp-modification-received' &&
          notification.message.email === 'pp@test.test' &&
          notification.variables.nom_projet === 'nomProjet' &&
          notification.variables.type_demande === 'puissance' &&
          notification.variables.button_url === routes.USER_LIST_REQUESTS &&
          notification.variables.button_title === 'Consulter la demande' &&
          notification.variables.button_instructions ===
            `Pour la consulter, connectez-vous à Potentiel.` &&
          notification.variables.demande_action_pp === undefined &&
          notification.context.modificationRequestId === demandeId &&
          notification.context.userId === userId &&
          notification.context.projectId === projetId
      )
    ).toBe(true)
  })

  it(`Lorsque le projet est mis à jour, une notification devrait être envoyée aux Dreals de la région du projet`, async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({
          id: projetId,
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

    await onChangementDePuissanceDemandé({
      sendNotification,
      findProjectById,
      findUserById,
      findUsersForDreal,
    })(
      new ChangementDePuissanceDemandé({
        payload: {
          demandeId,
          projetId,
          demandéPar: userId,
          puissance: 18,
          justification: 'justification',
          autorité: 'dreal',
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
            routes.DEMANDE_PAGE_DETAILS(demandeId) &&
          notification.variables.departement_projet === 'departement' &&
          notification.context.modificationRequestId === demandeId &&
          notification.context.dreal === 'regionA' &&
          notification.context.projectId === projetId
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
            routes.DEMANDE_PAGE_DETAILS(demandeId) &&
          notification.variables.departement_projet === 'departement' &&
          notification.context.modificationRequestId === demandeId &&
          notification.context.dreal === 'regionB' &&
          notification.context.projectId === projetId
      )
    ).toBe(true)
  })
})
