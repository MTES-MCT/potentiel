import { EventBus, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { UnauthorizedError } from '../../shared'
import { ProjectNewRulesOptedIn } from '../events'
import { Project } from '../Project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'
import { PasDeChangementDeCDCPourCetAOError } from '../errors'

type ChoisirNouveauCahierDesChargeDeps = {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
  projectRepo: Repository<Project>
  findAppelOffreById: AppelOffreRepo['findById']
}

type ChoisirNouveauCahierDesChargeArgs = {
  projetId: string
  utilisateur: User
}

export const makeChoisirNouveauCahierDesCharges =
  ({
    shouldUserAccessProject,
    eventBus,
    projectRepo,
    findAppelOffreById,
  }: ChoisirNouveauCahierDesChargeDeps) =>
  ({ projetId, utilisateur }: ChoisirNouveauCahierDesChargeArgs) => {
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
        return eventBus.publish(
          new ProjectNewRulesOptedIn({
            payload: { projectId: projetId, optedInBy: utilisateur.id },
          })
        )
      })
  }
