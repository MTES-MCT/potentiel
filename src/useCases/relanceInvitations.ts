import {
  ProjectAdmissionKey,
  makeProjectAdmissionKey,
  NotificationProps,
} from '../entities'
import { ProjectAdmissionKeyRepo } from '../dataAccess'
import { ResultAsync, Ok } from '../types'
import routes from '../routes'
import _ from 'lodash'

interface MakeUseCaseProps {
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  sendNotification: (props: NotificationProps) => Promise<void>
}

interface CallUseCaseProps {}

export default function makeRelanceInvitations({
  projectAdmissionKeyRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function relanceInvitations({}: CallUseCaseProps): ResultAsync<
    number
  > {
    const unusedInvitations = await projectAdmissionKeyRepo.findAll({
      lastUsedAt: 0,
      dreal: null,
      projectId: null,
    })

    const relances = await Promise.all(
      unusedInvitations.map(async (invitation) => {
        // Create a new projectAdmissionKey
        // Create an invitation link for this email
        const projectAdmissionKeyResult = makeProjectAdmissionKey({
          email: invitation.email,
          fullName: invitation.fullName,
        })

        if (projectAdmissionKeyResult.is_err()) {
          // OOPS
          console.log(
            'relanceInvitation use-case: error when calling makeProjectAdmissionKey with',
            invitation.email
          )
          return false
        }

        const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

        const insertionResult = await projectAdmissionKeyRepo.save(
          projectAdmissionKey
        )

        if (insertionResult.is_err()) {
          // OOPS
          console.log(
            'relanceInvitation use-case: error when calling projectAdmissionKeyRepo.save with',
            invitation.email
          )
          return false
        }

        // Update the old invitation
        invitation.lastUsedAt = projectAdmissionKey.createdAt
        const updateResult = await projectAdmissionKeyRepo.save(invitation)
        if (updateResult.is_err()) {
          // OOPS
          console.log(
            'relanceInvitation use-case: error when calling projectAdmissionKeyRepo.save on update for ',
            invitation.id
          )
          // Ignore
        }

        const subject = `Résultats de l'appel d'offres`
        // Call sendEmailNotification with the proper informations
        await sendNotification({
          type: 'relance-designation',
          context: {
            projectAdmissionKeyId: projectAdmissionKey.id,
          },
          variables: {
            invitation_link: routes.PROJECT_INVITATION({
              projectAdmissionKey: projectAdmissionKey.id,
            }),
          },
          message: {
            subject,
            email: projectAdmissionKey.email,
            name: projectAdmissionKey.fullName,
          },
        })

        return true
      })
    )

    const successFulRelances = relances.filter((relance) => relance).length

    return Ok(successFulRelances)
  }
}
