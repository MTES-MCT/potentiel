import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { logger, okAsync, ResultAsync } from '@core/utils'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { InfraNotAvailableError } from '@modules/shared'
import {
  DateMiseEnServiceRenseignée,
  DélaiCDC2022Appliqué,
  ProjectCompletionDueDateSet,
} from '../events'
import { Project } from '../Project'

type OnDateMiseEnServiceRenseignée = (
  event: DateMiseEnServiceRenseignée
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnDateMiseEnServiceRenseignée = (deps: {
  projectRepo: TransactionalRepository<Project>
  publishToEventStore: EventStore['publish']
  getProjectAppelOffre: GetProjectAppelOffre
}) => OnDateMiseEnServiceRenseignée

export const makeOnDateMiseEnServiceRenseignée: MakeOnDateMiseEnServiceRenseignée =
  ({ projectRepo, publishToEventStore, getProjectAppelOffre }) =>
  ({ payload: { projetId, dateMiseEnService } }) => {
    return projectRepo.transaction(
      new UniqueEntityID(projetId),
      ({
        appelOffreId,
        periodeId,
        familleId,
        cahierDesCharges,
        délaiCDC2022appliqué,
        completionDueOn,
      }) => {
        const appelOffre = getProjectAppelOffre({
          appelOffreId,
          periodeId,
          familleId,
        })
        if (!appelOffre) {
          logger.error(
            `project eventHandler onDateMiseEnServiceRenseignée : AO non trouvé. Projet ${projetId}`
          )
        }
        const dateMin = appelOffre?.type === 'eolien' ? '2022-06-01' : '2022-09-01'
        const dateMax = appelOffre?.type === 'eolien' ? '2024-09-30' : '2024-12-31'
        if (
          new Date(dateMiseEnService).getTime() < new Date(dateMin).getTime() ||
          new Date(dateMiseEnService).getTime() > new Date(dateMax).getTime()
        ) {
          return okAsync(null)
        }
        if (
          cahierDesCharges.type !== 'modifié' ||
          cahierDesCharges.paruLe !== '30/08/2022' ||
          délaiCDC2022appliqué
        ) {
          return okAsync(null)
        }
        const nouvelleDate = new Date(
          new Date(completionDueOn).setMonth(new Date(completionDueOn).getMonth() + 18)
        )

        return publishToEventStore(
          new ProjectCompletionDueDateSet({
            payload: { projectId: projetId, completionDueOn: nouvelleDate.getTime() },
          })
        ).andThen(() =>
          publishToEventStore(
            new DélaiCDC2022Appliqué({
              payload: {
                projetId,
                nouvelleDateLimiteAchèvement: nouvelleDate.toISOString(),
                ancienneDateLimiteAchèvement: new Date(completionDueOn).toISOString(),
              },
            })
          )
        )
      }
    )
  }
