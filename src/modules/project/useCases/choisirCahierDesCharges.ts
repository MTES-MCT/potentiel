import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User, CahierDesChargesRéférenceParsed, AppelOffre } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { CahierDesChargesChoisi } from '../events'
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

type Commande = {
  projetId: string
  utilisateur: User
  cahierDesCharges: CahierDesChargesRéférenceParsed
}

type ChoisirCahierDesCharges = (
  commande: Commande
) => ResultAsync<
  null,
  | UnauthorizedError
  | InfraNotAvailableError
  | NouveauCahierDesChargesDéjàSouscrit
  | CahierDesChargesInitialNonDisponibleError
  | PasDeChangementDeCDCPourCetAOError
  | CahierDesChargesNonDisponibleError
  | IdentifiantGestionnaireRéseauObligatoireError
  | IdentifiantGestionnaireRéseauExistantError
>

type MakeChoisirCahierDesCharges = (dépendances: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
  findAppelOffreById: AppelOffreRepo['findById']
}) => ChoisirCahierDesCharges

export const makeChoisirCahierDesCharges: MakeChoisirCahierDesCharges = ({
  shouldUserAccessProject,
  publishToEventStore,
  projectRepo,
  findAppelOffreById,
}) => {
  const vérifierAccèsProjet = (commande: Commande) => {
    const { projetId, utilisateur } = commande
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur })).andThen(
      (utilisateurALesDroits) =>
        utilisateurALesDroits ? okAsync(commande) : errAsync(new UnauthorizedError())
    )
  }

  const chargerProjetEtAO = (commande: Commande) =>
    projectRepo
      .load(new UniqueEntityID(commande.projetId))
      .andThen((projet) =>
        wrapInfra(findAppelOffreById(projet.appelOffreId)).andThen((appelOffre) =>
          appelOffre
            ? okAsync({ commande, appelOffre, projet })
            : errAsync(new EntityNotFoundError())
        )
      )

  const vérifierSiPasDéjàSouscrit = ({
    commande,
    appelOffre,
    projet,
  }: {
    commande: Commande
    projet: Project
    appelOffre: AppelOffre
  }) => {
    const { cahierDesCharges } = commande

    return cahierDesCharges.type === 'modifié' &&
      projet.cahierDesCharges.type === 'modifié' &&
      projet.cahierDesCharges.paruLe === cahierDesCharges.paruLe &&
      projet.cahierDesCharges.alternatif === cahierDesCharges.alternatif
      ? errAsync(new NouveauCahierDesChargesDéjàSouscrit())
      : okAsync({ commande, projet, appelOffre })
  }

  const vérifierSiPeutÊtreChoisi = ({
    commande,
    appelOffre,
    projet,
  }: {
    commande: Commande
    projet: Project
    appelOffre: AppelOffre
  }) => {
    const { cahierDesCharges } = commande

    if (cahierDesCharges.type === 'initial') {
      if (!appelOffre.doitPouvoirChoisirCDCInitial) {
        return errAsync(new CahierDesChargesInitialNonDisponibleError())
      }

      return okAsync({ commande, projet, appelOffre })
    }

    if (appelOffre.cahiersDesChargesModifiésDisponibles.length === 0) {
      return errAsync(new PasDeChangementDeCDCPourCetAOError())
    }

    const cahierDesChargesChoisi = appelOffre.cahiersDesChargesModifiésDisponibles.find(
      (c) => c.paruLe === cahierDesCharges.paruLe && c.alternatif === cahierDesCharges.alternatif
    )

    if (!cahierDesChargesChoisi) {
      return errAsync(new CahierDesChargesNonDisponibleError())
    }

    return okAsync({ commande, projet, appelOffre })
  }

  const vérifierIdentifiantGestionnaireRéseau = ({
    commande,
    appelOffre,
    projet,
  }: {
    commande: Commande
    projet: Project
    appelOffre: AppelOffre
  }) => {
    const { cahierDesCharges } = commande

    if (cahierDesCharges.type === 'initial') {
      return okAsync({ commande, projet, appelOffre })
    }

    const cahierDesChargesChoisi = appelOffre.cahiersDesChargesModifiésDisponibles.find(
      (c) => c.paruLe === cahierDesCharges.paruLe && c.alternatif === cahierDesCharges.alternatif
    )

    if (cahierDesChargesChoisi?.numéroGestionnaireRequis && !projet.identifiantGestionnaireRéseau) {
      return errAsync(new IdentifiantGestionnaireRéseauObligatoireError())
    }

    return okAsync({ commande, projet, appelOffre })
  }

  const enregistrerLeChoix = ({
    commande: { cahierDesCharges, projetId, utilisateur },
  }: {
    commande: Commande
  }) =>
    publishToEventStore(
      cahierDesCharges.type === 'initial'
        ? new CahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              type: 'initial',
            },
          })
        : new CahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar: utilisateur.id,
              type: 'modifié',
              paruLe: cahierDesCharges.paruLe,
              alternatif: cahierDesCharges.alternatif,
            },
          })
    )

  return (commande) =>
    vérifierAccèsProjet(commande)
      .andThen(chargerProjetEtAO)
      .andThen(vérifierSiPasDéjàSouscrit)
      .andThen(vérifierSiPeutÊtreChoisi)
      .andThen(vérifierIdentifiantGestionnaireRéseau)
      .andThen(enregistrerLeChoix)
}
