import { DonnéesCourriersRéponse, ProjectAppelOffre } from '@entities/appelOffre'

export type GetDonnéesCourriersRéponse = (
  cahierDesChargesActuel: string,
  projectAppelOffre: ProjectAppelOffre
) => DonnéesCourriersRéponse
