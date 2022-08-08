import { EventStore, Repository, TransactionalRepository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/modificationRequest/errors'
import { Project } from '@modules/project'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import moment from 'moment'
import { DemandeDélai } from '../DemandeDélai'
import { AccordDemandeDélaiAnnulé, RejetDemandeDélaiAnnulé } from '../events'

type AnnulerRéponseDemandeDélai = (commande: {
  user: User
  demandeDélaiId: string
}) => ResultAsync<null, InfraNotAvailableError | UnauthorizedError | EntityNotFoundError>

type MakeAnnulerRéponseDemandeDélai = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  demandeDélaiRepo: TransactionalRepository<DemandeDélai>
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
}) => AnnulerRéponseDemandeDélai

export const makeAnnulerRéponseDemandeDélai: MakeAnnulerRéponseDemandeDélai =
  ({ shouldUserAccessProject, demandeDélaiRepo, publishToEventStore, projectRepo }) =>
  ({ user, demandeDélaiId }) => {
    return demandeDélaiRepo.transaction(new UniqueEntityID(demandeDélaiId), (demandeDélai) => {
      const { statut, projetId } = demandeDélai
      if (!projetId) {
        return errAsync(new InfraNotAvailableError())
      }

      return wrapInfra(shouldUserAccessProject({ projectId: projetId, user })).andThen(
        (userHasRightsToProject) => {
          if (!userHasRightsToProject) {
            return errAsync(new UnauthorizedError())
          }
          if (statut === 'refusée') {
            return publishToEventStore(
              new RejetDemandeDélaiAnnulé({
                payload: { demandeDélaiId, projetId, annuléPar: user.id },
              })
            )
          }
          if (statut === 'accordée') {
            projectRepo.load(new UniqueEntityID(projetId)).andThen(({ completionDueOn }) => {
              if (demandeDélai.délaiEnMoisAccordé) {
                const nouvelleDateAchèvement = moment(completionDueOn)
                  .subtract(demandeDélai.délaiEnMoisAccordé, 'month')
                  .toDate()
                  .toISOString()

                return publishToEventStore(
                  new AccordDemandeDélaiAnnulé({
                    payload: {
                      demandeDélaiId,
                      projetId,
                      annuléPar: user.id,
                      nouvelleDateAchèvement,
                    },
                  })
                )
              }
              if (
                demandeDélai.ancienneDateThéoriqueAchèvement &&
                demandeDélai.dateAchèvementAccordée
              ) {
                const { ancienneDateThéoriqueAchèvement, dateAchèvementAccordée } = demandeDélai
                const délaiAccordéEnJours = getDays(
                  ancienneDateThéoriqueAchèvement,
                  dateAchèvementAccordée
                )

                const nouvelleDateAchèvement = moment(completionDueOn)
                  .subtract(délaiAccordéEnJours, 'days')
                  .toDate()
                  .toISOString()

                return publishToEventStore(
                  new AccordDemandeDélaiAnnulé({
                    payload: {
                      demandeDélaiId,
                      projetId,
                      annuléPar: user.id,
                      nouvelleDateAchèvement,
                    },
                  })
                )
              }
              return errAsync(new InfraNotAvailableError())
            })
          }
          return errAsync(new StatutRéponseIncompatibleAvecAnnulationError(statut || 'inconnu'))
        }
      )
    })
  }

function getDays(ancienneDate: string, nouvelleDate: string) {
  const diffInMs = new Date(nouvelleDate).getTime() - new Date(ancienneDate).getTime()
  return diffInMs / (1000 * 60 * 60 * 24)
}
