import { NotificationArgs } from '..'
import { UniqueEntityID } from '@core/domain'
import { makeProject } from '../../../entities'
import { None, Some } from '../../../types'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { ProjectGFSubmitted } from '../../project/events'
import { handleProjectGFSubmitted } from './handleProjectGFSubmitted'

const userId = new UniqueEntityID().toString()

describe('notification.handleProjectGFSubmitted', () => {
  it('should send a confirmation email to the PP that submitted the GF', async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(makeFakeProject({ nomProjet: 'nomProjet', regionProjet: 'region' })).unwrap()
    )
    const findUserById = jest.fn(async (userId: string) =>
      Some(makeFakeUser({ email: 'email@test.test', fullName: 'john doe' }))
    )
    const findUsersForDreal = jest.fn(async (region: string) => [])

    await handleProjectGFSubmitted({
      sendNotification,
      findUserById,
      findUsersForDreal,
      findProjectById,
    })(
      new ProjectGFSubmitted({
        payload: {
          projectId: 'projectId',
          gfDate: new Date(123),
          fileId: '',
          submittedBy: userId,
        },
        original: {
          version: 1,
          occurredAt: new Date(1),
        },
      })
    )

    expect(findProjectById).toHaveBeenCalledWith('projectId')
    expect(findUserById).toHaveBeenCalledWith(userId)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notifications = sendNotification.mock.calls.map((call) => call[0])
    expect(
      notifications.every(
        (notification) =>
          notification.type === 'pp-gf-notification' &&
          notification.message.email === 'email@test.test' &&
          notification.message.name === 'john doe' &&
          notification.variables.dreal === 'region' &&
          notification.variables.nomProjet === 'nomProjet' &&
          notification.variables.date_depot === '01/01/1970'
      )
    ).toBe(true)
  })

  it('should send an email to the DREAL users for the project region(s)', async () => {
    const sendNotification = jest.fn(async (args: NotificationArgs) => null)
    const findProjectById = jest.fn(async (region: string) =>
      makeProject(
        makeFakeProject({
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

    await handleProjectGFSubmitted({
      sendNotification,
      findUserById,
      findUsersForDreal,
      findProjectById,
    })(
      new ProjectGFSubmitted({
        payload: {
          projectId: 'projectId',
          gfDate: new Date(),
          fileId: '',
          submittedBy: userId,
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
          notification.type === 'dreal-gf-notification' &&
          notification.message.email === 'drealA@test.test' &&
          notification.message.name === 'drealA' &&
          notification.variables.departementProjet === 'departement' &&
          notification.variables.nomProjet === 'nomProjet'
      )
    ).toBe(true)
    expect(
      notifications.some(
        (notification) =>
          notification.type === 'dreal-gf-notification' &&
          notification.message.email === 'drealB@test.test' &&
          notification.message.name === 'drealB' &&
          notification.variables.departementProjet === 'departement' &&
          notification.variables.nomProjet === 'nomProjet'
      )
    ).toBe(true)
  })
})
