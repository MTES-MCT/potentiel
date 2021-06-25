import { okAsync } from 'neverthrow'
import { NotificationArgs } from '..'
import { UniqueEntityID } from '../../../core/domain'
import { makeProject } from '../../../entities'
import routes from '../../../routes'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { ModificationRequested } from '../../modificationRequest'
import { GetInfoForModificationRequested } from '../queries'
import { handleModificationRequested } from './handleModificationRequested'

const modificationRequestId = new UniqueEntityID().toString()
const userId = new UniqueEntityID().toString()
const projectId = new UniqueEntityID().toString()

describe('notification.handleModificationRequested', () => {
  const getInfoForModificationRequested = jest.fn((args: { projectId; userId }) =>
    okAsync({
      porteurProjet: { email: 'email@test.test', fullName: 'john doe' },
      nomProjet: 'nomProjet',
    })
  ) as GetInfoForModificationRequested

  const sendNotification = jest.fn(async (args: NotificationArgs) => null)

  describe('in general', () => {
    const isRequestForDreal = jest.fn(() => false)
    const findProjectById = jest.fn()
    const findUsersForDreal = jest.fn()

    it('should set send a status-update email to the PP that submitted the request', async () => {
      sendNotification.mockClear()

      await handleModificationRequested({
        sendNotification,
        getInfoForModificationRequested,
        isRequestForDreal,
        findUsersForDreal,
        findProjectById,
      })(
        new ModificationRequested({
          payload: {
            type: 'recours',
            modificationRequestId,
            projectId,
            requestedBy: userId,
          },
        })
      )

      expect(getInfoForModificationRequested).toHaveBeenCalledWith({ projectId, userId })

      expect(sendNotification).toHaveBeenCalledTimes(1)
      const notifications = sendNotification.mock.calls.map((call) => call[0])
      expect(
        notifications.every(
          (notification) =>
            notification.type === 'modification-request-status-update' &&
            notification.message.email === 'email@test.test' &&
            notification.message.name === 'john doe' &&
            notification.variables.status === 'envoyée' &&
            notification.variables.nom_projet === 'nomProjet' &&
            notification.variables.type_demande === 'recours' &&
            notification.variables.document_absent === ''
        )
      ).toBe(true)
    })
  })

  describe('when modification request type is destined to DREAL admins', () => {
    const isRequestForDreal = jest.fn(() => true)
    it('should send an email to the DREAL users for the project region(s)', async () => {
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
      const findUsersForDreal = jest.fn(async (region: string) =>
        region === 'regionA'
          ? [makeFakeUser({ email: 'drealA@test.test', fullName: 'drealA' })]
          : [makeFakeUser({ email: 'drealB@test.test', fullName: 'drealB' })]
      )

      await handleModificationRequested({
        sendNotification,
        findProjectById,
        getInfoForModificationRequested,
        findUsersForDreal,
        isRequestForDreal,
      })(
        new ModificationRequested({
          payload: {
            type: 'puissance',
            modificationRequestId,
            projectId,
            requestedBy: userId,
            puissance: 18,
            justification: 'justification',
          },
        })
      )

      expect(findUsersForDreal).toHaveBeenCalledTimes(2)
      expect(findUsersForDreal).toHaveBeenCalledWith('regionA')
      expect(findUsersForDreal).toHaveBeenCalledWith('regionB')

      expect(sendNotification).toHaveBeenCalledTimes(3)
      const notifications = sendNotification.mock.calls.map((call) => call[0])

      expect(
        notifications.some(
          (notification) =>
            notification.type === 'admin-modification-requested' &&
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
            notification.type === 'admin-modification-requested' &&
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
  })
})
