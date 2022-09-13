import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { NouveauCahierDesChargesChoisi } from '../events'
import { Project } from '../Project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'
import { PasDeChangementDeCDCPourCetAOError } from '../errors'

type ChoisirNouveauCahierDesCharge = (commande: {
  projetId: string
  utilisateur: User
}) => ResultAsync<
  null,
  | UnauthorizedError
  | NouveauCahierDesChargesDéjàSouscrit
  | PasDeChangementDeCDCPourCetAOError
  | InfraNotAvailableError
>

type MakeChoisirNouveauCahierDesCharges = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
  findAppelOffreById: AppelOffreRepo['findById']
}) => ChoisirNouveauCahierDesCharge

export const makeChoisirNouveauCahierDesCharges: MakeChoisirNouveauCahierDesCharges =
  ({ shouldUserAccessProject, publishToEventStore, projectRepo, findAppelOffreById }) =>
  ({ projetId, utilisateur }) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur }))
      .andThen((utilisateurALesDroits) => {
        if (!utilisateurALesDroits) return errAsync(new UnauthorizedError())
        return projectRepo.load(new UniqueEntityID(projetId))
      })
      .andThen((project) => {
        if (project.newRulesOptIn) return errAsync(new NouveauCahierDesChargesDéjàSouscrit())
        return wrapInfra(findAppelOffreById(project.appelOffreId))
      })
      .andThen((appelOffre) => {
        if (!appelOffre?.choisirNouveauCahierDesCharges) {
          return errAsync(new PasDeChangementDeCDCPourCetAOError())
        }
        return publishToEventStore(
          new NouveauCahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              paruLe: '30/07/2021',
            },
          })
        )
      })
  }
