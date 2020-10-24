import { makeProjectAdmissionKey } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import ROUTES from '../../routes'
import { projectAdmissionKeyRepo } from '../../dataAccess'

const createInvitationForTests = async (request: HttpRequest) => {
  const { email } = request.body

  if (!email) {
    console.log('createInvitationForTests missing email')
    return SystemError('missing email')
  }

  const projectAdmissionKeyResult = makeProjectAdmissionKey({
    email,
    fullName: 'test user',
  })

  if (projectAdmissionKeyResult.is_err()) {
    // OOPS
    console.log('createInvitationForTests: error when calling makeProjectAdmissionKey with', {
      email,
    })
    return SystemError('Impossible de créer le projectAdmissionKey')
  }

  const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

  await projectAdmissionKeyRepo.save(projectAdmissionKey)

  return Success(ROUTES.PROJECT_INVITATION({ projectAdmissionKey: projectAdmissionKey.id }))
}

export { createInvitationForTests }
