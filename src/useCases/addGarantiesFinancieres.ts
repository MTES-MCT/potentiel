import {
  Project,
  User,
  makeProject,
  applyProjectUpdate,
  NotificationProps,
} from '../entities'
import { ProjectRepo, UserRepo, ProjectAdmissionKeyRepo } from '../dataAccess'
import _ from 'lodash'
import moment from 'moment'
import { ResultAsync, Ok, Err, ErrorResult } from '../types'
import routes from '../routes'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  userRepo: UserRepo
  projectAdmissionKeyRepo: ProjectAdmissionKeyRepo
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
  sendNotification: (props: NotificationProps) => Promise<void>
}

interface CallUseCaseProps {
  filename: string
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED =
  "Vous n'avez pas le droit de déposer les garanties financières pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeAddGarantiesFinancieres({
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
  shouldUserAccessProject,
  sendNotification,
}: MakeUseCaseProps) {
  return async function addGarantiesFinancieres({
    filename,
    date,
    projectId,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    const access = await shouldUserAccessProject({ user, projectId })

    if (!access) return ErrorResult(UNAUTHORIZED)

    const projectRes = await projectRepo.findById(projectId)

    if (projectRes.is_none()) {
      console.log('addGarantiesFinancières failed because projectRes.is_none()')
      return ErrorResult(UNAUTHORIZED)
    }

    const project = projectRes.unwrap()

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        garantiesFinancieresDate: date,
        garantiesFinancieresFile: filename,
        garantiesFinancieresSubmittedOn: Date.now(),
        garantiesFinancieresSubmittedBy: user.id,
      },
      context: {
        userId: user.id,
        type: 'garanties-financieres-submission',
      },
    })

    if (!updatedProject) {
      // OOPS
      console.log(
        'addGarantiesFinancieres use-case: applyProjectUpdate returned null'
      )

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await projectRepo.save(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    // Notify porteur de projet
    await sendNotification({
      type: 'pp-gf-notification',
      message: {
        email: user.email,
        name: user.fullName,
        subject: "Confirmation d'envoi des garanties financières",
      },
      context: {
        projectId: project.id,
        userId: user.id,
      },
      variables: {
        nomProjet: project.nomProjet,
        dreal: project.regionProjet,
        date_depot: moment(project.garantiesFinancieresDate).format(
          'DD/MM/YYYY'
        ),
      },
    })

    // Notifiy DREAL users for this region
    const regions = project.regionProjet.split(' / ')
    await Promise.all(
      regions.map(async (region) => {
        // Notifiy existing dreal users
        const drealUsers = await userRepo.findUsersForDreal(region)
        await Promise.all(
          drealUsers.map((drealUser) =>
            sendNotification({
              type: 'dreal-gf-notification',
              message: {
                email: drealUser.email,
                name: drealUser.fullName,
                subject:
                  'Potentiel - Nouveau dépôt de garantie financière dans votre région, département ' +
                  project.departementProjet,
              },
              context: {
                projectId: project.id,
                dreal: region,
                userId: drealUser.id,
              },
              variables: {
                nomProjet: project.nomProjet,
                departementProjet: project.departementProjet,
                invitation_link: routes.GARANTIES_FINANCIERES_LIST,
              },
            })
          )
        )

        // Notify invited dreal users
        const invitedDrealUsers = await projectAdmissionKeyRepo.findAll({
          dreal: region,
        })
        await Promise.all(
          invitedDrealUsers
            .filter(
              (invitation) =>
                // Filter out all the users that have already created an account
                !drealUsers.find(
                  (drealUser) => invitation.email === drealUser.email
                )
            )
            .map((invitation) =>
              sendNotification({
                type: 'dreal-gf-notification',
                message: {
                  email: invitation.email,
                  name: invitation.fullName,
                  subject:
                    'Potentiel - Nouveau dépôt de garantie financière dans votre région, département ' +
                    project.departementProjet,
                },
                context: {
                  projectId: project.id,
                  dreal: region,
                },
                variables: {
                  nomProjet: project.nomProjet,
                  departementProjet: project.departementProjet,
                  invitation_link: routes.DREAL_INVITATION({
                    projectAdmissionKey: invitation.id,
                  }),
                },
              })
            )
        )
      })
    )

    return Ok(null)
  }
}
