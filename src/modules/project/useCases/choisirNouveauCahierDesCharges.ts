import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User, CahierDesChargesRéférenceParsed } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import {
  CahierDesChargesChoisi,
  NouveauCahierDesChargesChoisi,
  NumeroGestionnaireSubmitted,
} from '../events'
import { Project } from '../Project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'
import {
  CahierDesChargesNonDisponibleError,
  IdentifiantGestionnaireRéseauObligatoireError,
  PasDeChangementDeCDCPourCetAOError,
} from '../errors'

type ChoisirNouveauCahierDesCharges = (commande: {
  projetId: string
  utilisateur: User
  cahierDesCharges: CahierDesChargesRéférenceParsed
  identifiantGestionnaireRéseau?: string
}) => ResultAsync<
  null,
  | UnauthorizedError
  | NouveauCahierDesChargesDéjàSouscrit
  | PasDeChangementDeCDCPourCetAOError
  | CahierDesChargesNonDisponibleError
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
  ({
    projetId,
    utilisateur,
    cahierDesCharges: { paruLe, alternatif },
    identifiantGestionnaireRéseau,
  }) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur }))
      .andThen((utilisateurALesDroits) => {
        if (!utilisateurALesDroits) {
          return errAsync(new UnauthorizedError())
        }

        return projectRepo.load(new UniqueEntityID(projetId))
      })
      .andThen((project) => {
        if (
          project.cahierDesCharges.paruLe === paruLe &&
          project.cahierDesCharges.alternatif === alternatif
        ) {
          return errAsync(new NouveauCahierDesChargesDéjàSouscrit())
        }

        return wrapInfra(findAppelOffreById(project.appelOffreId)).andThen((appelOffre) =>
          appelOffre ? okAsync(appelOffre) : errAsync(new EntityNotFoundError())
        )
      })
      .andThen((appelOffre) => {
        if (paruLe === 'initial' && !appelOffre.doitPouvoirChoisirCDCInitial) {
          return errAsync(new CahierDesChargesNonDisponibleError())
        }

        if (paruLe === 'initial') {
          return publishToEventStore(
            new CahierDesChargesChoisi({
              payload: {
                projetId,
                choisiPar: utilisateur.id,
                type: 'initial',
              },
            })
          )
        }

        if (appelOffre.cahiersDesChargesModifiésDisponibles.length === 0) {
          return errAsync(new PasDeChangementDeCDCPourCetAOError())
        }

        const cahierDesChargesChoisi = appelOffre.cahiersDesChargesModifiésDisponibles.find(
          (c) => c.paruLe === paruLe && c.alternatif === alternatif
        )

        if (!cahierDesChargesChoisi) {
          return errAsync(new CahierDesChargesNonDisponibleError())
        }

        if (cahierDesChargesChoisi.numéroGestionnaireRequis && !identifiantGestionnaireRéseau) {
          return errAsync(new IdentifiantGestionnaireRéseauObligatoireError())
        }

        if (cahierDesChargesChoisi.numéroGestionnaireRequis && identifiantGestionnaireRéseau) {
          return publishToEventStore(
            new NumeroGestionnaireSubmitted({
              payload: {
                projectId: projetId,
                submittedBy: utilisateur.id,
                numeroGestionnaire: identifiantGestionnaireRéseau,
              },
            })
          ).andThen(() =>
            publishToEventStore(
              new NouveauCahierDesChargesChoisi({
                payload: {
                  projetId,
                  choisiPar: utilisateur.id,
                  paruLe,
                  alternatif,
                },
              })
            )
          )
        }

        return publishToEventStore(
          new NouveauCahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              paruLe,
              alternatif,
            },
          })
        )
      })
  }
