import { Project, User, makeProject, applyProjectUpdate } from '../entities'
import { ProjectRepo, UserRepo, ProjectAdmissionKeyRepo } from '../dataAccess'
import _ from 'lodash'
import moment from 'moment'
import { ResultAsync, Ok, Err, ErrorResult } from '../types'
import routes from '../routes'
import { FileService, File, FileContainer } from '../modules/file'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { NotificationService } from '../modules/notification'
import { EventStore } from '../modules/eventStore'
import { ProjectGFSubmitted } from '../modules/project/events'

interface MakeUseCaseProps {
  eventStore: EventStore
  fileService: FileService
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  findUsersForDreal: UserRepo['findUsersForDreal']
  findAllProjectAdmissionKeys: ProjectAdmissionKeyRepo['findAll']
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
  sendNotification: NotificationService['sendNotification']
}

interface CallUseCaseProps {
  file: FileContainer
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED =
  "Vous n'avez pas le droit de déposer les garanties financières pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeAddGarantiesFinancieres({
  eventStore,
  fileService,
  findProjectById,
  saveProject,
  findUsersForDreal,
  findAllProjectAdmissionKeys,
  shouldUserAccessProject,
  sendNotification,
}: MakeUseCaseProps) {
  return async function addGarantiesFinancieres({
    file,
    date,
    projectId,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    // console.log('addGarantiesFinancieres', filename, date, projectId)
    const access = await shouldUserAccessProject({ user, projectId })

    if (!access) return ErrorResult(UNAUTHORIZED)

    const project = await findProjectById(projectId)

    if (!project) {
      console.log('addGarantiesFinancières failed because projectRes.is_none()')
      return ErrorResult(UNAUTHORIZED)
    }

    const fileResult = File.create({
      designation: 'garantie-financiere',
      forProject: project.id,
      createdBy: user.id,
      filename: file.path,
    })

    if (fileResult.isErr()) {
      console.log(
        'addGarantiesFinancieres use-case: File.create failed',
        fileResult.error
      )

      return ErrorResult(SYSTEM_ERROR)
    }

    const saveFileResult = await fileService.save(fileResult.value, {
      ...file,
      path: makeProjectFilePath(projectId, file.path).filepath,
    })

    if (saveFileResult.isErr()) {
      // OOPS
      console.log(
        'addGarantiesFinancieres use-case: fileService.save failed',
        saveFileResult.error
      )

      return ErrorResult(SYSTEM_ERROR)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        garantiesFinancieresDate: date,
        garantiesFinancieresFileId: fileResult.value.id.toString(),
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

      // TODO: Remove uploaded file

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await saveProject(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    await eventStore.publish(
      new ProjectGFSubmitted({
        payload: {
          projectId: project.id,
          gfDate: new Date(date),
          fileId: fileResult.value.id.toString(),
          submittedBy: user.id,
        },
        aggregateId: project.id,
      })
    )

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
        const drealUsers = await findUsersForDreal(region)
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
        const invitedDrealUsers = await findAllProjectAdmissionKeys({
          dreal: region,
          lastUsedAt: 0,
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
