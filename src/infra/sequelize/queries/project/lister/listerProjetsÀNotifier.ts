import { AppelOffre, isNotifiedPeriode } from '@entities'
import { FiltreListeProjets } from '@modules/project'
import { MakeListerProjetsÀNotifier } from '@modules/notificationCandidats/queries'

export const makeListerProjetsÀNotifier: MakeListerProjetsÀNotifier =
  ({
    findExistingAppelsOffres,
    findExistingPeriodesForAppelOffre,
    countUnnotifiedProjects,
    listerProjetsNonNotifiés,
    appelOffreRepo,
  }) =>
  async ({ appelOffreId, periodeId, pagination, recherche, classement }) => {
    const résultat: any = {}

    const appelsOffres = await appelOffreRepo.findAll()

    // Récupérer tous les AOs qui ont au moins un projet non-notifié
    résultat.existingAppelsOffres = (
      await findExistingAppelsOffres({
        isNotified: false,
      })
    ).map((appelOffreId) => ({
      id: appelOffreId,
      shortTitle: appelsOffres.find((item) => item.id === appelOffreId)?.shortTitle || appelOffreId,
    }))

    // Arrêter ici s'il n'y a aucun projet à notifier
    if (!résultat.existingAppelsOffres.length) return null

    const getPeriodesWithNotifiableProjectsForAppelOffre = async (_appelOffre: AppelOffre) =>
      (
        await findExistingPeriodesForAppelOffre(_appelOffre.id, {
          isNotified: false,
        })
      )
        .map((periodeId) => {
          // Seulement les périodes pour lesquelles on peut générer une attestation
          const periode = _appelOffre.periodes.find((periode) => periode.id === periodeId)

          return (
            !!periode &&
            !!isNotifiedPeriode(periode) && {
              id: periodeId,
              title: periode.title,
            }
          )
        })
        .filter((item) => !!item)

    if (appelOffreId) {
      résultat.selectedAppelOffreId = appelOffreId
      const selectedAppelOffre = appelsOffres.find(
        (appelOffre) => appelOffre.id === résultat.selectedAppelOffreId
      )
      if (!selectedAppelOffre) return null

      résultat.existingPeriodes = await getPeriodesWithNotifiableProjectsForAppelOffre(
        selectedAppelOffre
      )
    } else {
      // Si pas d'AO donné, rechercher un AO qui a des projets à notifier
      for (const appelOffreItem of résultat.existingAppelsOffres) {
        const appelOffre = appelsOffres.find((appelOffre) => appelOffre.id === appelOffreItem.id)

        if (!appelOffre) continue
        résultat.selectedAppelOffreId = appelOffreItem.id
        résultat.existingPeriodes = await getPeriodesWithNotifiableProjectsForAppelOffre(appelOffre)

        if (résultat.existingPeriodes.length) break
      }
    }

    // Arrêter là s'il n'y a aucun projet à notifier
    if (!résultat.existingPeriodes.length) return null

    // La période séléctionnée est soit celle donnée (doit être dans la liste), soit la première disponible de la liste
    résultat.selectedPeriodeId =
      (periodeId &&
        résultat.existingPeriodes.map((item) => item.id).includes(periodeId) &&
        periodeId) ||
      résultat.existingPeriodes[0].id

    // Compte de tous les projets de la période donnée
    résultat.projectsInPeriodCount = await countUnnotifiedProjects(
      résultat.selectedAppelOffreId,
      résultat.selectedPeriodeId
    )

    // Retourner tous les projets de l'AO, période, correspondant aux filtres donnés
    const filtres: FiltreListeProjets = {
      recherche,
      classement,
      appelOffre: {
        appelOffreId: résultat.selectedAppelOffreId,
        periodeId: résultat.selectedPeriodeId,
      },
    }

    résultat.projects = await listerProjetsNonNotifiés({ filtres, pagination })

    return résultat
  }
