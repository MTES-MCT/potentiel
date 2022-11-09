import { EventStore, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { logger, okAsync, ResultAsync } from '@core/utils'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { InfraNotAvailableError } from '@modules/shared'
import { DonnéesDeRaccordementRenseignées, ProjectCompletionDueDateSet } from '../events'
import { Project } from '../Project'

type onDonnéesDeRaccordementRenseignées = (
  event: DonnéesDeRaccordementRenseignées
) => ResultAsync<null, InfraNotAvailableError>

type MakeOnDateMiseEnServiceRenseignée = (deps: {
  projectRepo: TransactionalRepository<Project>
  publishToEventStore: EventStore['publish']
  getProjectAppelOffre: GetProjectAppelOffre
}) => onDonnéesDeRaccordementRenseignées

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
            `project eventHandler onDonnéesDeRaccordementRenseignées : AO non trouvé. Projet ${projetId}`
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
        if (!donnéesCDC || !donnéesCDC.délaiApplicable) {
          logger.error(
            `project eventHandler onDonnéesDeRaccordementRenseignées : données CDC modifié non trouvées. Projet ${projetId}`
          )
          return okAsync(null)
        }
        if (
          new Date(dateMiseEnService).getTime() <
            new Date(donnéesCDC.délaiApplicable.intervaleDateMiseEnService.min).getTime() ||
          new Date(dateMiseEnService).getTime() >
            new Date(donnéesCDC.délaiApplicable.intervaleDateMiseEnService.max).getTime()
        ) {
          return okAsync(null)
        }
        const nouvelleDate = new Date(
          new Date(completionDueOn).setMonth(
            new Date(completionDueOn).getMonth() + donnéesCDC.délaiApplicable.délaiEnMois
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
