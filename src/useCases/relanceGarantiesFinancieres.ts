import moment from 'moment'
import { EventBus } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectRepo } from '@dataAccess'
import { applyProjectUpdate, isNotifiedPeriode } from '@entities'
import { NotificationService } from '@modules/notification'
import { ProjectGFReminded } from '@modules/project'
import routes from '@routes'
import { Ok, ResultAsync } from '../types'

interface MakeUseCaseProps {
  eventBus: EventBus
  findProjectsWithGarantiesFinancieresPendingBefore: ProjectRepo['findProjectsWithGarantiesFinancieresPendingBefore']
  getUsersForProject: ProjectRepo['getUsers']
  saveProject: ProjectRepo['save']
  sendNotification: NotificationService['sendNotification']
}

export default function makeRelanceGarantiesFinancieres({
  eventBus,
  findProjectsWithGarantiesFinancieresPendingBefore,
  getUsersForProject,
  saveProject,
  sendNotification,
}: MakeUseCaseProps) {
  return async function relanceGarantiesFinancieres(): ResultAsync<null> {
    const lateProjects = await findProjectsWithGarantiesFinancieresPendingBefore(
      moment().add(15, 'days').toDate().getTime()
    )

    await Promise.all(
      lateProjects.map(async (project) => {
        if (project.appelOffre?.periode && !isNotifiedPeriode(project.appelOffre?.periode)) {
          logger.error(
            `Relance impossible pour un projet qui est dans une période non-notifiée sur Potentiel. Id : ${project.id}`
          )

          return
        }

        if (project.famille?.soumisAuxGarantiesFinancieres === 'non soumis') {
          logger.error(
            `Relance impossible pour un projet qui est dans une famille non soumise aux garanties financieres. Id : ${project.id}`
          )
          return
        }

        if (project.appelOffre?.soumisAuxGarantiesFinancieres === 'non soumis') {
          logger.error(
            `Relance impossible sur un projet dont l'AO n'est pas soumis aux GF. Id : ${project.id}`
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
                code_projet: project.potentielIdentifier,
                date_designation: moment(project.notifiedOn).format('DD/MM/YYYY'),
                paragraphe_cdc:
                  project.appelOffre?.renvoiRetraitDesignationGarantieFinancieres || '',
                duree_garanties:
                  project.famille?.soumisAuxGarantiesFinancieres === 'après candidature'
                    ? project.famille.garantieFinanciereEnMois?.toString()
                    : project.appelOffre?.soumisAuxGarantiesFinancieres === 'après candidature'
                    ? project.appelOffre.garantieFinanciereEnMois.toString()
                    : '',
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
          if (updateRes.isErr()) {
            logger.error(
              `relanceGarantiesFinancieres use-case: error when calling projectRepo.save`
            )
            logger.info(
              'relanceGarantiesFinancieres use-case: error when calling projectRepo.save',
              updatedProject
            )
            return
          }

          await eventBus.publish(
            new ProjectGFReminded({
              payload: {
                projectId: project.id,
              },
            })
          )
        }
      })
    )

    return Ok(null)
  }
}
