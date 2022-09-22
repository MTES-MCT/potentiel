import { DonnéesCourriersRéponse, ProjectAppelOffre } from '@entities/appelOffre'
import { CahierDesChargesActuel } from '@entities/cahierDesCharges'

export type GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel: CahierDesChargesActuel,
  projectAppelOffre: ProjectAppelOffre
) => DonnéesCourriersRéponse
