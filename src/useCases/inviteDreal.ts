import _ from 'lodash'
import {
  CredentialsRepo,
  ProjectAdmissionKeyRepo,
  ProjectRepo,
  UserRepo,
  AppelOffreRepo,
} from '../dataAccess'
import {
  makeProjectAdmissionKey,
  Project,
  User,
  ProjectAdmissionKey,
  AppelOffre,
  Periode,
  NotificationProps,
  DREAL,
} from '../entities'
import { ErrorResult, Ok, ResultAsync, Err } from '../types'
import routes from '../routes'
import { importProjects } from '.'

interface MakeUseCaseProps {
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  userRepo: UserRepo
  sendNotification: (props: NotificationProps) => Promise<void>
}

interface CallUseCaseProps {
  email: string
  region: DREAL
  user: User
}

export const ACCESS_DENIED_ERROR =
  "Vous n'avez pas le droit d'inviter un utilisateur DREAL"

export const SYSTEM_ERROR =
  "Il y a eu un problème lors de l'invitation. Merci de réessayer."

export default function makeInviteDreal({
  credentialsRepo,
  projectAdmissionKeyRepo,
  userRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function inviteDreal({
    email,
    user,
    region,
  }: CallUseCaseProps): ResultAsync<null> {
    const access = user.role === 'admin'

    if (!access) {
      return ErrorResult(ACCESS_DENIED_ERROR)
    }

    // Check if the email is already a known user
    const existingUserWithEmail = await credentialsRepo.findByEmail(email)

    if (existingUserWithEmail.is_some()) {
      // The user exists, add dreal to this user
      const { userId } = existingUserWithEmail.unwrap()
      const result = await userRepo.addToDreal(userId, region)
      if (result.is_err()) {
        console.log(
          'inviteDreal use-case failed on call to userRepo.addToDreal',
          result.unwrap_err()
        )
        return ErrorResult(SYSTEM_ERROR)
      }

      // Success: send invitation
      // try {
      //   await sendDrealInvitation({
      //     subject: `${user.fullName} vous invite à suivre les projets de votre région sur Potentiel`,
      //     destinationEmail: email,
      //     invitationLink: routes.ADMIN_LIST_PROJECTS,
      //   })
      // } catch (error) {
      //   console.log(
      //     'inviteDreal use-case: error when calling sendDrealInvitation for existing user',
      //     error
      //   )
      // }
      return Ok(null)
    }

    // The invited user doesn't exist yet

    // Create a project admission key
    const projectAdmissionKeyResult = makeProjectAdmissionKey({
      email,
      dreal: region,
      fullName: '',
    })
    if (projectAdmissionKeyResult.is_err()) {
      console.log(
        'inviteDreal use-case failed on call to makeProjectAdmissionKey',
        projectAdmissionKeyResult.unwrap_err()
      )
      return ErrorResult(SYSTEM_ERROR)
    }
    const projectAdmissionKey = projectAdmissionKeyResult.unwrap()
    const projectAdmissionKeyInsertion = await projectAdmissionKeyRepo.insert(
      projectAdmissionKey
    )
    if (projectAdmissionKeyInsertion.is_err()) {
      console.log(
        'inviteDreal use-case failed on call to projectAdmissionKeyRepo.insert',
        projectAdmissionKeyResult.unwrap_err()
      )
      return ErrorResult(SYSTEM_ERROR)
    }

    // Send email invitation

    // Call sendDrealInvitation with the proper informations
    try {
      await sendNotification({
        type: 'dreal-invitation',
        message: {
          email,
          subject: `${user.fullName} vous invite à suivre les projets de votre région sur Potentiel`,
        },
        context: {
          projectAdmissionKeyId: projectAdmissionKey.id,
          dreal: region,
        },
        variables: {
          invitation_link: routes.DREAL_INVITATION({
            projectAdmissionKey: projectAdmissionKey.id,
          }),
        },
      })
      return Ok(null)
    } catch (error) {
      console.log(
        'inviteDreal use-case: error when calling sendDrealInvitation',
        error
      )
      return Err(error)
    }
  }
}
