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
} from '../entities'
import { ErrorResult, Ok, ResultAsync, Err } from '../types'
import routes from '../routes'
import { importProjects } from '.'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  userRepo: UserRepo
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
  sendNotification: (props: NotificationProps) => Promise<void>
}

interface CallUseCaseProps {
  email: string
  user: User
  projectId: string
}

export const ACCESS_DENIED_ERROR =
  "Vous n'avez pas le droit d'inviter un utilisateur sur ce projet"

export const SYSTEM_ERROR =
  "Il y a eu un problème lors de l'invitation. Merci de réessayer."

export default function makeInviteUserToProject({
  projectRepo,
  projectAdmissionKeyRepo,
  credentialsRepo,
  userRepo,
  shouldUserAccessProject,
  sendNotification,
}: MakeUseCaseProps) {
  return async function inviteUserToProject({
    email,
    user,
    projectId,
  }: CallUseCaseProps): ResultAsync<null> {
    // Check if the user has the rights to this project
    const access = await shouldUserAccessProject({
      user,
      projectId,
    })

    if (!access) {
      return ErrorResult(ACCESS_DENIED_ERROR)
    }

    // Check if the email is already a known user
    const existingUserWithEmail = await credentialsRepo.findByEmail(email)

    // Get project info
    const project = await projectRepo.findById(projectId)
    if (project.is_none()) {
      console.log(
        'inviteUserToProject use-case failed on call to projectRepo.findById'
      )
      return ErrorResult(SYSTEM_ERROR)
    }

    if (existingUserWithEmail.is_some()) {
      // The user exists, add project to this user
      const { userId } = existingUserWithEmail.unwrap()
      const result = await userRepo.addProject(userId, projectId)
      if (result.is_err()) {
        console.log(
          'inviteUserToProject use-case failed on call to userRepo.addProject',
          result.unwrap_err()
        )
        return ErrorResult(SYSTEM_ERROR)
      }

      // Success: send invitation
      await sendNotification({
        type: 'project-invitation',
        message: {
          email,
          subject: `${user.fullName} vous invite à suivre un projet sur Potentiel`,
        },
        variables: {
          nomProjet: project.unwrap().nomProjet,
          // This link is a link to the project itself
          invitation_link: routes.PROJECT_DETAILS(projectId),
        },
        context: {
          projectId,
          userId,
        },
      })
      return Ok(null)
    }

    // The invited user doesn't exist yet

    // Create a project admission key
    const projectAdmissionKeyResult = makeProjectAdmissionKey({
      email,
      projectId,
      fullName: '',
    })
    if (projectAdmissionKeyResult.is_err()) {
      console.log(
        'inviteUserToProject use-case failed on call to makeProjectAdmissionKey',
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
        'inviteUserToProject use-case failed on call to projectAdmissionKeyRepo.insert',
        projectAdmissionKeyResult.unwrap_err()
      )
      return ErrorResult(SYSTEM_ERROR)
    }

    // Send email invitation

    // Call sendProjectInvitation with the proper informations
    await sendNotification({
      type: 'project-invitation',
      message: {
        email,
        subject: `${user.fullName} vous invite à suivre un projet sur Potentiel`,
      },
      variables: {
        nomProjet: project.unwrap().nomProjet,
        // This link is a link to the project itself
        invitation_link: routes.PROJECT_INVITATION({
          projectAdmissionKey: projectAdmissionKey.id,
        }),
      },
      context: {
        projectId,
        projectAdmissionKeyId: projectAdmissionKey.id,
      },
    })
    return Ok(null)
  }
}
