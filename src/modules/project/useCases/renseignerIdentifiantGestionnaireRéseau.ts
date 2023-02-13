import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, okAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { UnauthorizedError } from '@modules/shared'
import { Project } from '../Project'
import { TrouverProjetsParIdentifiantGestionnaireRéseau } from '../queries'
import {
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
} from '../errors'
import { NumeroGestionnaireSubmitted } from '../events'

type Commande = {
  projetId: string
  utilisateur: User
  identifiantGestionnaireRéseau: string
}

export const makeRenseignerIdentifiantGestionnaireRéseau = ({
  shouldUserAccessProject,
  publishToEventStore,
  projectRepo,
  trouverProjetsParIdentifiantGestionnaireRéseau,
}: {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
  trouverProjetsParIdentifiantGestionnaireRéseau: TrouverProjetsParIdentifiantGestionnaireRéseau
}) => {
  const chargerProjet = (commande: { projetId: string; utilisateur: User }) => {
    const { projetId, utilisateur } = commande
    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: utilisateur })).andThen(
      (utilisateurALesDroits) =>
        utilisateurALesDroits
          ? projectRepo.load(new UniqueEntityID(projetId)).map((projet) => ({
              commande,
              projet,
            }))
          : errAsync(new UnauthorizedError())
    )
  }

  const vérifierIdentifiantGestionnaireRéseau = ({
    commande,
    projet,
  }: {
    commande: Commande
    projet: Project
  }) => {
    if (!commande.identifiantGestionnaireRéseau) {
      return errAsync(new IdentifiantGestionnaireRéseauObligatoireError())
    }

    return trouverProjetsParIdentifiantGestionnaireRéseau(
      commande.identifiantGestionnaireRéseau
    ).andThen((projets) => {
      const existePourUnAutreProjet = projets.filter((p) => p !== commande.projetId).length > 0

      return existePourUnAutreProjet
        ? errAsync(new IdentifiantGestionnaireRéseauExistantError())
        : okAsync({ commande, projet })
    })
  }

  const enregistrerLeChoix = ({
    projet,
    commande: { projetId, utilisateur, identifiantGestionnaireRéseau },
  }: {
    commande: Commande
    projet: Project
  }) =>
    projet.identifiantGestionnaireRéseau !== identifiantGestionnaireRéseau
      ? publishToEventStore(
          new NumeroGestionnaireSubmitted({
            payload: {
              projectId: projetId,
              submittedBy: utilisateur.id,
              numeroGestionnaire: identifiantGestionnaireRéseau,
            },
          })
        )
      : okAsync(null)

  return (commande) =>
    chargerProjet(commande)
      .andThen(vérifierIdentifiantGestionnaireRéseau)
      .andThen(enregistrerLeChoix)
}
