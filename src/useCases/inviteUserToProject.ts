import { logger } from '../core/utils'
import { CredentialsRepo, ProjectAdmissionKeyRepo, ProjectRepo, UserRepo } from '../dataAccess'
import { makeProjectAdmissionKey, Project, User } from '../entities'
import { NotificationService } from '../modules/notification'
import routes from '../routes'
import { ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  findProjectById: ProjectRepo['findById']
  credentialsRepo: CredentialsRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  userRepo: UserRepo
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
  sendNotification: NotificationService['sendNotification']
}

interface CallUseCaseProps {
  email: string
  user: User
  projectId: string | string[]
}

export const ACCESS_DENIED_ERROR = "Vous n'avez pas le droit d'inviter un utilisateur sur ce projet"

export const SYSTEM_ERROR = "Il y a eu un problème lors de l'invitation. Merci de réessayer."

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
      await Promise.all(projectIds.map((projectId) => findProjectById(projectId)))
    ).filter(Boolean) as Project[]

    if (!projects.length) {
      logger.error(
        `inviteUserToProject use-case failed to find any of the projects requested. Ids: ${projectIds}`
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
        logger.error('inviteUserToProject use-case some calls to userRepo.addProject failed')
        logger.info(
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

    const projectAdmissionKeys = projects
      .map((project) => {
        const projectAdmissionKeyResult = makeProjectAdmissionKey({
          email,
          projectId: project.id,
          fullName: '',
        })

        if (projectAdmissionKeyResult.is_err()) {
          logger.error(projectAdmissionKeyResult.unwrap_err())
        }

        return projectAdmissionKeyResult
      })
      .filter((res) => res.is_ok())
      .map((res) => res.unwrap())

    const saveResults = await Promise.all(projectAdmissionKeys.map(projectAdmissionKeyRepo.save))

    if (saveResults.some((res) => res.is_err())) {
      logger.error('inviteUserToProject use-case failed some calls to projectAdmissionKeyRepo.save')
      logger.info(
        'inviteUserToProject use-case failed some calls to projectAdmissionKeyRepo.save',
        saveResults.filter((res) => res.is_err()).map((res) => res.unwrap_err())
      )
    }

    if (saveResults.every((res) => res.is_err())) {
      return ErrorResult(SYSTEM_ERROR)
    }

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
