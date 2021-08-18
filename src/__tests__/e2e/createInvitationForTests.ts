import { logger } from '../../core/utils'
import { projectAdmissionKeyRepo } from '../../dataAccess'
import { makeProjectAdmissionKey } from '../../entities'
import ROUTES from '../../routes'
import { testRouter } from './testRouter'

testRouter.post('/test/createInvitation', async (request, response) => {
  const { email } = request.body

  if (!email) {
    logger.error('createInvitationForTests missing email')
    return response.status(500).send('missing email')
  }

  const projectAdmissionKeyResult = makeProjectAdmissionKey({
    email,
    fullName: 'test user',
  })

  if (projectAdmissionKeyResult.is_err()) {
    logger.error(
      `createInvitationForTests: error when calling makeProjectAdmissionKey with' ${email}`
    )
    return response.status(500).send('Impossible de créer le projectAdmissionKey')
  }

  const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

  await projectAdmissionKeyRepo.save(projectAdmissionKey)

  return response.send(ROUTES.PROJECT_INVITATION({ projectAdmissionKey: projectAdmissionKey.id }))
})
