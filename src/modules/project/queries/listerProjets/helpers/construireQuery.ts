import { ProjectFilters } from '@dataAccess'

export const construireQuery = (filtres) => {
  const query: ProjectFilters = {
    isNotified: true,
  }

  if (filtres.appelOffreId) {
    query.appelOffreId = filtres.appelOffreId

    if (filtres.periodeId) {
      query.periodeId = filtres.periodeId
    }

    if (filtres.familleId) {
      query.familleId = filtres.familleId
    }
  }

  switch (filtres.classement) {
    case 'classés':
      query.isClasse = true
      query.isAbandoned = false
      break
    case 'éliminés':
      query.isClasse = false
      query.isAbandoned = false
      break
    case 'abandons':
      query.isAbandoned = true
      break
  }

  if (filtres.reclames) {
    query.isClaimed = filtres.reclames === 'réclamés'
  }

  if (filtres.garantiesFinancieres) {
    query.garantiesFinancieres = filtres.garantiesFinancieres
  }

  return query
}
