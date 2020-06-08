import {
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
} from '../../dataAccess'
import { User, makeProjectAdmissionKey } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import makeFakeProject from '../fixtures/project'

const addInvitationsForTests = async (request: HttpRequest) => {
  // console.log('addInvitationsForTests', request.body)
  const { invitations } = request.body

  if (!invitations) {
    console.log('tests/addInvitationsForTests missing invitations')
    return SystemError('tests/addInvitationsForTests missing invitations')
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
    console.log('addProjects for Tests could not add all required projects')
    invitations
      .map(makeProjectAdmissionKey)
      .filter((item) => item.is_err())
      .forEach((error) => {
        console.log(error.unwrap_err())
      })
  }

  await Promise.all(builtInvitations.map(projectAdmissionKeyRepo.save))

  console.log(
    'addInvitationsForTests inserted ' +
      builtInvitations.length +
      ' invitations'
  )

  return Success('success')
}

export { addInvitationsForTests }
