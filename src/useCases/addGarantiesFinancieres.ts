import moment from 'moment'
import { Repository, UniqueEntityID } from '../core/domain'
import { ProjectAdmissionKeyRepo, ProjectRepo, UserRepo } from '../dataAccess'
import { applyProjectUpdate, Project, User } from '../entities'
import { EventBus } from '../modules/eventStore'
import { FileContents, FileObject, makeFileObject } from '../modules/file'
import { NotificationService } from '../modules/notification'
import { ProjectGFSubmitted } from '../modules/project/events'
import routes from '../routes'
import { Err, ErrorResult, Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  eventBus: EventBus
  fileRepo: Repository<FileObject>
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  findUsersForDreal: UserRepo['findUsersForDreal']
  findAllProjectAdmissionKeys: ProjectAdmissionKeyRepo['findAll']
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>
  sendNotification: NotificationService['sendNotification']
}

interface CallUseCaseProps {
  file: {
    contents: FileContents
    filename: string
  }
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED =
  "Vous n'avez pas le droit de déposer les garanties financières pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeAddGarantiesFinancieres({
  eventBus,
  fileRepo,
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
    const access = await shouldUserAccessProject({ user, projectId })

    if (!access) return ErrorResult(UNAUTHORIZED)

    const project = await findProjectById(projectId)

    if (!project) {
      console.log('addGarantiesFinancières failed because projectRes.is_none()')
      return ErrorResult(UNAUTHORIZED)
    }

    const { contents, filename } = file

    const fileIdResult = await makeFileObject({
      designation: 'dcr',
      forProject: new UniqueEntityID(project.id),
      createdBy: new UniqueEntityID(user.id),
      filename,
      contents,
    }).asyncAndThen((file) => fileRepo.save(file).map(() => file.id.toString()))

    if (fileIdResult.isErr()) {
      console.error('addGarantiesFinancières use-case: failed to save file', fileIdResult.error)
      return ErrorResult(SYSTEM_ERROR)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        garantiesFinancieresDate: date,
        garantiesFinancieresFileId: fileIdResult.value.toString(),
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
      console.log('addGarantiesFinancieres use-case: applyProjectUpdate returned null')

      // TODO: Remove uploaded file

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await saveProject(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    await eventBus.publish(
      new ProjectGFSubmitted({
        payload: {
          projectId: project.id,
          gfDate: new Date(date),
          fileId: fileIdResult.value.toString(),
          submittedBy: user.id,
        },
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
        date_depot: moment(project.garantiesFinancieresDate).format('DD/MM/YYYY'),
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
                !drealUsers.find((drealUser) => invitation.email === drealUser.email)
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
