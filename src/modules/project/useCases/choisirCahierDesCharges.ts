import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User, CahierDesChargesRéférenceParsed } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { CahierDesChargesChoisi, NumeroGestionnaireSubmitted } from '../events'
import { Project } from '../Project'
import { NouveauCahierDesChargesDéjàSouscrit } from '../errors/NouveauCahierDesChargesDéjàSouscrit'
import { AppelOffreRepo } from '@dataAccess'
import {
  CahierDesChargesNonDisponibleError,
  IdentifiantGestionnaireRéseauObligatoireError,
  PasDeChangementDeCDCPourCetAOError,
  CahierDesChargesInitialNonDisponibleError,
  IdentifiantGestionnaireRéseauExistantError,
} from '../errors'
import { IdentifiantGestionnaireRéseauExistant } from '../queries'

type ChoisirCahierDesCharges = (commande: {
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

type MakeChoisirCahierDesCharges = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
  findAppelOffreById: AppelOffreRepo['findById']
  identifiantGestionnaireRéseauExistant: IdentifiantGestionnaireRéseauExistant
}) => ChoisirCahierDesCharges

export const makeChoisirCahierDesCharges: MakeChoisirCahierDesCharges =
  ({
    shouldUserAccessProject,
    publishToEventStore,
    projectRepo,
    findAppelOffreById,
    identifiantGestionnaireRéseauExistant,
  }) =>
  ({ projetId, utilisateur, cahierDesCharges, identifiantGestionnaireRéseau }) => {
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur }))
      .andThen((utilisateurALesDroits) => {
        if (!utilisateurALesDroits) {
          return errAsync(new UnauthorizedError())
        }

        return projectRepo.load(new UniqueEntityID(projetId))
      })
      .andThen((project) => {
        if (
          cahierDesCharges.type === 'modifié' &&
          project.cahierDesCharges.type === 'modifié' &&
          project.cahierDesCharges.paruLe === cahierDesCharges.paruLe &&
          project.cahierDesCharges.alternatif === cahierDesCharges.alternatif
        ) {
          return errAsync(new NouveauCahierDesChargesDéjàSouscrit())
        }

        return wrapInfra(findAppelOffreById(project.appelOffreId)).andThen((appelOffre) =>
          appelOffre ? okAsync(appelOffre) : errAsync(new EntityNotFoundError())
        )
      })
      .andThen((appelOffre) => {
        if (cahierDesCharges.type === 'initial' && !appelOffre.doitPouvoirChoisirCDCInitial) {
          return errAsync(new CahierDesChargesInitialNonDisponibleError())
        }

        if (cahierDesCharges.type === 'initial') {
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
          (c) =>
            c.paruLe === cahierDesCharges.paruLe && c.alternatif === cahierDesCharges.alternatif
        )

        if (!cahierDesChargesChoisi) {
          return errAsync(new CahierDesChargesNonDisponibleError())
        }

        if (cahierDesChargesChoisi.numéroGestionnaireRequis && !identifiantGestionnaireRéseau) {
          return errAsync(new IdentifiantGestionnaireRéseauObligatoireError())
        }

        if (cahierDesChargesChoisi.numéroGestionnaireRequis && identifiantGestionnaireRéseau) {
          return identifiantGestionnaireRéseauExistant(identifiantGestionnaireRéseau).andThen(
            (existe) => {
              return existe
                ? errAsync(new IdentifiantGestionnaireRéseauExistantError())
                : publishToEventStore(
                    new NumeroGestionnaireSubmitted({
                      payload: {
                        projectId: projetId,
                        submittedBy: utilisateur.id,
                        numeroGestionnaire: identifiantGestionnaireRéseau,
                      },
                    })
                  ).andThen(() =>
                    publishToEventStore(
                      new CahierDesChargesChoisi({
                        payload: {
                          projetId,
                          choisiPar: utilisateur.id,
                          type: 'modifié',
                          paruLe: cahierDesCharges.paruLe,
                          alternatif: cahierDesCharges.alternatif,
                        },
                      })
                    )
                  )
            }
          )
        }

        return publishToEventStore(
          new CahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              type: 'modifié',
              paruLe: cahierDesCharges.paruLe,
              alternatif: cahierDesCharges.alternatif,
            },
          })
        )
      })
  }
