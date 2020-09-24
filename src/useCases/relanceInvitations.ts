import { ProjectAdmissionKeyRepo } from '../dataAccess'
import {
  AppelOffre,
  makeProjectAdmissionKey,
  Periode,
  ProjectAdmissionKey,
} from '../entities'
import { NotificationService } from '../modules/notification'
import routes from '../routes'
import { Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  sendNotification: NotificationService['sendNotification']
}

type CallUseCaseProps =
  | {
      beforeDate: number
    }
  | {
      keys: string[]
    }
  | {
      appelOffreId: AppelOffre['id']
      periodeId?: Periode['id']
    }
  | undefined

export default function makeRelanceInvitations({
  projectAdmissionKeyRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function relanceInvitations(
    props: CallUseCaseProps
  ): ResultAsync<number> {
    let unusedInvitations: ProjectAdmissionKey[]

    const keys = props && 'keys' in props ? props.keys : undefined
    const beforeDate =
      props && 'beforeDate' in props ? props.beforeDate : undefined

    const { appelOffreId, periodeId } =
      props && 'appelOffreId' in props
        ? props
        : { appelOffreId: undefined, periodeId: undefined }

    if (keys && keys.length) {
      // console.log('relanceInvitation usecase: specific keys', keys)
      unusedInvitations = (
        await Promise.all(
          keys.map((key) => projectAdmissionKeyRepo.findById(key))
        )
      )
        .filter((item) => item.is_some())
        .map((item) => item.unwrap())
        .filter((item) => !item.lastUsedAt && !item.dreal && !item.projectId)
    } else if (appelOffreId) {
      unusedInvitations = await projectAdmissionKeyRepo.findAll({
        lastUsedAt: 0,
        dreal: null,
        projectId: null,
        appelOffreId,
        ...(periodeId ? { periodeId } : {}),
      })
    } else if (beforeDate) {
      unusedInvitations = await projectAdmissionKeyRepo.findAll({
        lastUsedAt: 0,
        dreal: null,
        projectId: null,
        createdAt: { before: beforeDate },
      })
    } else {
      // All unused invitations
      // console.log('relanceInvitation usecase: all')
      unusedInvitations = await projectAdmissionKeyRepo.findAll({
        lastUsedAt: 0,
        dreal: null,
        projectId: null,
      })
    }

    // We want to send a new invitation to each unique email that has a pending invitation, older than beforeDate
    // For each of these pending invitations, we will set the lastUsedAt to simulate that they have been used (so they won't appear again as they are replaced by a new invitation)
    // If one of these users has a more recent invitation, we need to set the lastUsedAt on that invitation as well
    // At the end, each email should have only one pending invitation remaining (the new one)

    const uniqueEmails = Object.keys(
      unusedInvitations.reduce(
        (map, invitation) => ({
          ...map,
          [invitation.email]: true,
        }),
        {}
      )
    )

    // TODO: For each unique email, create new projectAdmissionKey and fetch all projectAdmissionKeys and update their lastUsedAt

    const relances = await Promise.all(
      uniqueEmails.map(async (email) => {
        // Get all the previous admission keys for this email (that have not been used)
        const projectAdmissionKeysForEmail = await projectAdmissionKeyRepo.findAll(
          {
            email,
            lastUsedAt: 0,
          }
        )

        const fullName =
          projectAdmissionKeysForEmail.find((item) => !!item.fullName)
            ?.fullName || ''

        // Create a new projectAdmissionKey
        // Create an invitation link for this email
        const newProjectAdmissionKeyResult = makeProjectAdmissionKey({
          email: email,
          fullName,
        })

        if (newProjectAdmissionKeyResult.is_err()) {
          // OOPS
          console.log(
            'relanceInvitation use-case: error when calling makeProjectAdmissionKey with',
            email
          )
          return false
        }

        const newProjectAdmissionKey = newProjectAdmissionKeyResult.unwrap()

        const insertionResult = await projectAdmissionKeyRepo.save(
          newProjectAdmissionKey
        )

        if (insertionResult.is_err()) {
          // OOPS
          console.log(
            'relanceInvitation use-case: error when calling projectAdmissionKeyRepo.save with',
            email
          )
          return false
        }

        // Update all the old invitations
        await Promise.all(
          projectAdmissionKeysForEmail.map((oldProjectAdmissionKey) => {
            oldProjectAdmissionKey.lastUsedAt = newProjectAdmissionKey.createdAt
            return projectAdmissionKeyRepo.save(oldProjectAdmissionKey)
          })
        )

        const subject = `Résultats de l'appel d'offres`
        // Call sendEmailNotification with the proper informations
        await sendNotification({
          type: 'relance-designation',
          context: {
            projectAdmissionKeyId: newProjectAdmissionKey.id,
          },
          variables: {
            invitation_link: routes.PROJECT_INVITATION({
              projectAdmissionKey: newProjectAdmissionKey.id,
            }),
          },
          message: {
            subject,
            email,
            name: fullName,
          },
        })

        return true
      })
    )

    const successFulRelances = relances.filter((relance) => relance).length

    return Ok(successFulRelances)
  }
}
