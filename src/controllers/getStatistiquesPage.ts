import { Success, Redirect } from '../helpers/responses'
import { HttpRequest } from '../types'
import { StatistiquesPage } from '../views/pages'
import routes from '../routes'

const getStatistiquesPage = async (request: HttpRequest) => {
  const props = {
    projetsTotal: 962,
    projetsLaureats: 558,
    porteursProjetNotifies: 162,
    porteursProjetNotifiesInscrits: 140,
    parrainages: 45,
    telechargementsAttestation: 863,
    projetsAvecAttestation: 925,
    gfDeposees: 100,
    gfDues: 152,
    dcrDeposees: 73,
    dcrDues: 260,
    demandes: {
      actionnaire: 0,
      producteur: 0,
      fournisseur: 0,
      puissance: 2,
      abandon: 1,
      recours: 7,
      delai: 0,
    },
  }

  return Success(
    StatistiquesPage({
      request,
      ...props,
    })
  )
}
export { getStatistiquesPage }
