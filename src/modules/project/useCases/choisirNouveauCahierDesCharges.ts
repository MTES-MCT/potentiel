import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { NouveauCahierDesChargesChoisi } from '../events'
import { Project } from '../Project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'
import { CahierDesChargesNonDisponibleError, PasDeChangementDeCDCPourCetAOError } from '../errors'

type ChoisirNouveauCahierDesCharges = (commande: {
  projetId: string
  utilisateur: User
  cahierDesCharges: { paruLe: '30/07/2021' | '30/08/2022' }
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
}) => ChoisirNouveauCahierDesCharges

export const makeChoisirNouveauCahierDesCharges: MakeChoisirNouveauCahierDesCharges =
  ({ shouldUserAccessProject, publishToEventStore, projectRepo, findAppelOffreById }) =>
  ({ projetId, utilisateur, cahierDesCharges: { paruLe } }) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur }))
      .andThen((utilisateurALesDroits) => {
        if (!utilisateurALesDroits) {
          return errAsync(new UnauthorizedError())
        }

        return projectRepo.load(new UniqueEntityID(projetId))
      })
      .andThen((project) => {
        if (project.cahierDesCharges.paruLe === paruLe) {
          return errAsync(new NouveauCahierDesChargesDéjàSouscrit())
        }

        return wrapInfra(findAppelOffreById(project.appelOffreId))
      })
      .andThen((appelOffre) => {
        if (appelOffre && appelOffre.cahiersDesChargesModifiésDisponibles.length === 0) {
          return errAsync(new PasDeChangementDeCDCPourCetAOError())
        }

        if (
          appelOffre &&
          !appelOffre.cahiersDesChargesModifiésDisponibles.find((c) => c.paruLe === paruLe)
        ) {
          return errAsync(new CahierDesChargesNonDisponibleError())
        }

        return publishToEventStore(
          new NouveauCahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              paruLe,
            },
          })
        )
      })
  }
