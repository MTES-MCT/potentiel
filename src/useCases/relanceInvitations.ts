import {
  ProjectAdmissionKey,
  makeProjectAdmissionKey,
  NotificationProps,
} from '../entities'
import { ProjectAdmissionKeyRepo } from '../dataAccess'
import { ResultAsync, Ok } from '../types'
import routes from '../routes'
import _ from 'lodash'
import project from '../entities/project'

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

    // Map of <email, ProjectAdmissionKey> (the new project admission key)
    const relanceByEmail: Record<string, ProjectAdmissionKey> = {}

    const relances = await Promise.all(
      unusedInvitations.map(async (invitation) => {
        let userHasAlreadyReceivedRelance = !!relanceByEmail[invitation.email]

        if (!userHasAlreadyReceivedRelance) {
          // User has not received a relance yet

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

          relanceByEmail[invitation.email] = projectAdmissionKey

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
        }

        const { createdAt, id, email, fullName } = relanceByEmail[
          invitation.email
        ]

        // Update the old invitation
        invitation.lastUsedAt = createdAt
        const updateResult = await projectAdmissionKeyRepo.save(invitation)
        if (updateResult.is_err()) {
          // OOPS
          console.log(
            'relanceInvitation use-case: error when calling projectAdmissionKeyRepo.save on update for ',
            invitation.id
          )
          // Ignore
        }

        if (!userHasAlreadyReceivedRelance) {
          const subject = `Résultats de l'appel d'offres`
          // Call sendEmailNotification with the proper informations
          await sendNotification({
            type: 'relance-designation',
            context: {
              projectAdmissionKeyId: id,
            },
            variables: {
              invitation_link: routes.PROJECT_INVITATION({
                projectAdmissionKey: id,
              }),
            },
            message: {
              subject,
              email,
              name: fullName,
            },
          })
        }

        return !userHasAlreadyReceivedRelance
      })
    )

    const successFulRelances = relances.filter((relance) => relance).length

    return Ok(successFulRelances)
  }
}
