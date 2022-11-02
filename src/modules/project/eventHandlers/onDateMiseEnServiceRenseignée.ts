import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { logger, okAsync, ResultAsync } from '@core/utils'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { InfraNotAvailableError } from '@modules/shared'
import { DateMiseEnServiceRenseignée, ProjectCompletionDueDateSet } from '../events'
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
        if (
          cahierDesCharges.type !== 'modifié' ||
          cahierDesCharges.paruLe !== '30/08/2022' ||
          délaiCDC2022appliqué
        ) {
          return okAsync(null)
        }
        const projectAppelOffre = getProjectAppelOffre({
          appelOffreId,
          periodeId,
          familleId,
        })
        if (!projectAppelOffre) {
          logger.error(
            `project eventHandler onDateMiseEnServiceRenseignée : AO non trouvé. Projet ${projetId}`
          )
          return okAsync(null)
        }
        const donnéesCDC =
          projectAppelOffre.cahiersDesChargesModifiésDisponibles &&
          projectAppelOffre.cahiersDesChargesModifiésDisponibles.find(
            (CDC) =>
              CDC.type === 'modifié' &&
              CDC.paruLe === '30/08/2022' &&
              CDC.alternatif === cahierDesCharges.alternatif
          )
        if (!donnéesCDC || !donnéesCDC.délaiCDC2022) {
          logger.error(
            `project eventHandler onDateMiseEnServiceRenseignée : données CDC modifié non trouvées. Projet ${projetId}`
          )
          return okAsync(null)
        }
        if (
          new Date(dateMiseEnService).getTime() <
            new Date(donnéesCDC.délaiCDC2022.datesLimitesMeS.min).getTime() ||
          new Date(dateMiseEnService).getTime() >
            new Date(donnéesCDC.délaiCDC2022.datesLimitesMeS.max).getTime()
        ) {
          return okAsync(null)
        }
        const nouvelleDate = new Date(
          new Date(completionDueOn).setMonth(
            new Date(completionDueOn).getMonth() + donnéesCDC.délaiCDC2022.délaiApplicableEnMois
          )
        )

        return publishToEventStore(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: projetId,
              completionDueOn: nouvelleDate.getTime(),
              reason: 'délaiCdc2022',
            },
          })
        )
      }
    )
  }
