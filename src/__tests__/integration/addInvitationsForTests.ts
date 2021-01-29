import { logger } from '../../core/utils'
import { projectAdmissionKeyRepo } from '../../dataAccess'
import { makeProjectAdmissionKey } from '../../entities'
import { testRouter } from './testRouter'

testRouter.post('/test/addInvitations', async (request, response) => {
  const { invitations } = request.body

  if (!invitations) {
    logger.error('tests/addInvitationsForTests missing invitations')
    return response.status(500).send('tests/addInvitationsForTests missing invitations')
  }

  const builtInvitations = invitations
    .map((invitation) => {
      if (invitation.createdAt) {
        invitation.createdAt = Number(invitation.createdAt)
      }
      if (invitation.lastUsedAt) {
        invitation.lastUsedAt = Number(invitation.lastUsedAt)
      }

      Object.entries(invitation).forEach(([key, value]) => {
        if (value === '') {
          delete invitation[key]
        }
      })

      if (!invitation.fullName) {
        invitation.fullName = ''
      }

      return invitation
    })
    .map(makeProjectAdmissionKey)
    .filter((item) => item.is_ok())
    .map((item) => item.unwrap())

  if (builtInvitations.length !== invitations.length) {
    logger.error('addProjects for Tests could not add all required projects')
    invitations
      .map(makeProjectAdmissionKey)
      .filter((item) => item.is_err())
      .forEach((error) => {
        logger.error(error.unwrap_err())
      })
  }

  await Promise.all(builtInvitations.map(projectAdmissionKeyRepo.save))

  logger.info(`addInvitationsForTests inserted ${builtInvitations.length} invitations`)

  return response.send('success')
})
