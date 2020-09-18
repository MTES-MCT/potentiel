import {
  ProjectAdmissionKey,
  makeProjectAdmissionKey,
  NotificationProps,
  AppelOffre,
  makeProjectIdentifier,
  applyProjectUpdate,
  Periode,
} from '../entities'
import { ProjectRepo } from '../dataAccess'
import { ResultAsync, Ok } from '../types'
import routes from '../routes'
import _ from 'lodash'
import moment from 'moment'
import { NotificationService } from '../modules/notification'

interface MakeUseCaseProps {
  findProjectsWithGarantiesFinancieresPendingBefore: ProjectRepo['findProjectsWithGarantiesFinancieresPendingBefore']
  getUsersForProject: ProjectRepo['getUsers']
  saveProject: ProjectRepo['save']
  sendNotification: NotificationService['sendNotification']
}

export default function makeRelanceGarantiesFinancieres({
  findProjectsWithGarantiesFinancieresPendingBefore,
  getUsersForProject,
  saveProject,
  sendNotification,
}: MakeUseCaseProps) {
  return async function relanceGarantiesFinancieres(): ResultAsync<null> {
    const lateProjects = await findProjectsWithGarantiesFinancieresPendingBefore(
      moment().add(15, 'days').toDate().getTime()
    )

    console.log(
      'relanceGarantiesFinancieres found ' +
        lateProjects.length +
        ' projets à relancer'
    )

    await Promise.all(
      lateProjects.map(async (project) => {
        if (!project.appelOffre?.periode?.isNotifiedOnPotentiel) {
          console.log(
            'Relance impossible pour un projet qui est dans une période non-notifiée sur Potentiel',
            project.id
          )
          return
        }

        if (!project.famille?.garantieFinanciereEnMois) {
          console.log(
            'Relance impossible pour un projet qui est dans une famille non soumise aux garanties financieres',
            project.id
          )
          return
        }

        if (!project.appelOffre?.renvoiRetraitDesignationGarantieFinancieres) {
          console.log(
            'Relance impossible sur un projet sans renvoi retrait designation garanties financieres',
            project.id
          )
          return
        }

        const projectUsers = await getUsersForProject(project.id)

        await Promise.all(
          projectUsers.map((user) =>
            sendNotification({
              type: 'relance-gf',
              context: {
                projectId: project.id,
                userId: user.id,
              },
              variables: {
                nom_projet: project.nomProjet,
                code_projet: makeProjectIdentifier(project),
                date_designation: moment(project.notifiedOn).format(
                  'DD/MM/YYYY'
                ),
                paragraphe_cdc:
                  project.appelOffre
                    ?.renvoiRetraitDesignationGarantieFinancieres || '',
                duree_garanties:
                  project.famille?.garantieFinanciereEnMois.toString() || '',
                invitation_link: routes.PROJECT_DETAILS(project.id),
              },
              message: {
                subject: `Rappel constitution garantie financière ${project.nomProjet}`,
                email: user.email,
                name: user.fullName,
              },
            })
          )
        )

        const updatedProject = applyProjectUpdate({
          project,
          update: { garantiesFinancieresRelanceOn: Date.now() },
          context: {
            userId: '',
            type: 'relance-gf',
          },
        })

        if (updatedProject) {
          const updateRes = await saveProject(updatedProject)
          if (updateRes.is_err()) {
            // OOPS
            console.log(
              'relanceGarantiesFinancieres use-case: error when calling projectRepo.save',
              updatedProject
            )

            return
          }
        }
      })
    )

    return Ok(null)
  }
}
