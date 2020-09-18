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
import { NotificationService } from '../modules/notification'

interface MakeUseCaseProps {
  findProjectById: ProjectRepo['findById']
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  userRepo: UserRepo
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
  sendNotification: NotificationService['sendNotification']
}

interface CallUseCaseProps {
  email: string
  user: User
  projectId: string | string[]
}

export const ACCESS_DENIED_ERROR =
  "Vous n'avez pas le droit d'inviter un utilisateur sur ce projet"

export const SYSTEM_ERROR =
  "Il y a eu un problème lors de l'invitation. Merci de réessayer."

export default function makeInviteUserToProject({
  findProjectById,
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
    const access = Array.isArray(projectId)
      ? (
          await Promise.all(
            projectId.map((projectId) =>
              shouldUserAccessProject({
                user,
                projectId,
              })
            )
          )
        ).every((item) => !!item)
      : await shouldUserAccessProject({
          user,
          projectId,
        })

    if (!access) {
      return ErrorResult(ACCESS_DENIED_ERROR)
    }

    // Check if the email is already a known user
    const existingUserWithEmail = await credentialsRepo.findByEmail(email)

    const projectIds = Array.isArray(projectId) ? projectId : [projectId]

    const projects = (
      await Promise.all(
        projectIds.map((projectId) => findProjectById(projectId))
      )
    ).filter((item) => typeof item !== undefined) as Project[]

    if (!projects.length) {
      console.log(
        'inviteUserToProject use-case failed to find any of the projects requested',
        projectIds
      )
      return ErrorResult(SYSTEM_ERROR)
    }

    if (existingUserWithEmail.is_some()) {
      // The user exists, add project to this user
      const { userId } = existingUserWithEmail.unwrap()
      const results = await Promise.all(
        projects.map((project) => userRepo.addProject(userId, project.id))
      )

      if (results.some((res) => res.is_err())) {
        console.log(
          'inviteUserToProject use-case some calls to userRepo.addProject failed',
          results.filter((res) => res.is_err()).map((res) => res.unwrap_err())
        )
      }

      if (results.every((res) => res.is_err())) {
        return ErrorResult(SYSTEM_ERROR)
      }

      // Success: send invitation
      await sendNotification({
        type: 'project-invitation',
        message: {
          email,
          subject: `${user.fullName} vous invite à suivre ${
            projects.length > 1 ? 'des projets' : 'un projet'
          } sur Potentiel`,
        },
        variables: {
          nomProjet: projects.map((item) => item.nomProjet).join(', '),
          invitation_link:
            projects.length > 1
              ? routes.USER_LIST_PROJECTS
              : routes.PROJECT_DETAILS(projects[0].id),
        },
        context: {
          projectId: projects.map((item) => item.id).join(','),
          userId: user.id,
        },
      })
      return Ok(null)
    }

    // The invited user doesn't exist yet

    // Create a project admission key per project

    const projectAdmissionKeyResults = await Promise.all(
      projects
        .map((project) => {
          const projectAdmissionKeyResult = makeProjectAdmissionKey({
            email,
            projectId: project.id,
            fullName: '',
          })

          if (projectAdmissionKeyResult.is_err()) {
            console.log(
              'inviteUserToProject use-case failed on call to makeProjectAdmissionKey',
              projectAdmissionKeyResult.unwrap_err()
            )
          }

          return projectAdmissionKeyResult
        })
        .filter((res) => res.is_ok())
        .map((res) => res.unwrap())
        .map(projectAdmissionKeyRepo.save)
    )

    if (projectAdmissionKeyResults.some((res) => res.is_err())) {
      console.log(
        'inviteUserToProject use-case failed some calls to projectAdmissionKeyRepo.save',
        projectAdmissionKeyResults
          .filter((res) => res.is_err())
          .map((res) => res.unwrap_err())
      )
    }

    if (projectAdmissionKeyResults.every((res) => res.is_err())) {
      return ErrorResult(SYSTEM_ERROR)
    }

    const projectAdmissionKeys = projectAdmissionKeyResults
      .filter((res) => res.is_ok())
      .map((res) => res.unwrap())

    // Send email invitation

    // Call sendProjectInvitation with the proper informations
    await sendNotification({
      type: 'project-invitation',
      message: {
        email,
        subject: `${user.fullName} vous invite à suivre ${
          projects.length > 1 ? 'des projets' : 'un projet'
        } sur Potentiel`,
      },
      variables: {
        nomProjet: projects.map((item) => item.nomProjet).join(', '),
        // This link is a link to the project itself
        invitation_link: routes.PROJECT_INVITATION({
          projectAdmissionKey: projectAdmissionKeys[0].id,
        }),
      },
      context: {
        projectId: projects.map((item) => item.id).join(','),
        projectAdmissionKeyId: projectAdmissionKeys[0].id,
      },
    })
    return Ok(null)
  }
}
