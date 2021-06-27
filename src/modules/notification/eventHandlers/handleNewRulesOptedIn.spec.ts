import { NotificationArgs } from '..'
import { UniqueEntityID } from '../../../core/domain'
import { makeUser } from '../../../entities'
import { Some, UnwrapForTest } from '../../../types'
import { ProjectNewRulesOptedIn } from '../../project'
import { handleNewRulesOptedIn } from './handleNewRulesOptedIn'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeProject } from '../../../entities'

const projectId = new UniqueEntityID().toString()
const userId = new UniqueEntityID().toString()

describe('notification.handleNewRulesOptedIn', () => {
  const sendNotification = jest.fn(async (args: NotificationArgs) => null)
  const findProjectById = jest.fn(async (region: string) =>
    makeProject(makeFakeProject({ id: projectId, nomProjet: 'nomProjet' })).unwrap()
  )
  const findUserById = jest.fn(async (userId: string) =>
    Some(makeFakeUser({ email: 'porteur@test.test', fullName: 'john doe' }))
  )

  it('should call sendNotification for the porteur projet which opted in for the new rules', async () => {
    sendNotification.mockClear()

    await handleNewRulesOptedIn({ findProjectById, findUserById, sendNotification })(
      new ProjectNewRulesOptedIn({
        payload: { projectId, optedInBy: userId },
      })
    )

    expect(findProjectById).toHaveBeenCalledWith(projectId)
    expect(findUserById).toHaveBeenCalledWith(userId)

    expect(sendNotification).toHaveBeenCalledTimes(1)
    const notification = sendNotification.mock.calls[0][0]

    expect(notification.message.email).toEqual('porteur@test.test')

    expect(
      notification.type === 'pp-new-rules-opted-in' &&
        notification.variables.nom_projet === 'nomProjet'
    ).toBe(true)
  })
})
