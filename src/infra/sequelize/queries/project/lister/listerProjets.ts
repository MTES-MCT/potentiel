import { ListerProjets } from '@modules/project'
import { makePaginatedList } from '../../../../../helpers/paginate'
import { listerProjetsAccèsComplet } from './requêtes/listerProjetsAccèsComplet'
import { listerProjetsPourDreal } from './requêtes/listerProjetsPourDreal'
import { listerProjetsPourAdeme } from './requêtes/listerProjetsPourAdeme'
import { listerProjetsPourCaisseDesDépôts } from './requêtes/listerProjetsPourCaisseDesDépôts'
import { listerProjetsPourPorteur } from './requêtes/listerProjetsPourPorteur'
import { listerProjetsPourAcheteurObligé } from './requêtes/listerProjetsAcheteurObligé'

export const listerProjets: ListerProjets = async (args) => {
  const { user, pagination } = args

  switch (user.role) {
    case 'admin':
    case 'dgec-validateur':
    case 'cre':
      return await listerProjetsAccèsComplet(args)
    case 'acheteur-obligé':
      return await listerProjetsPourAcheteurObligé(args)
    case 'dreal':
      return await listerProjetsPourDreal(args)
    case 'ademe':
      return await listerProjetsPourAdeme(args)
    case 'caisse-des-dépôts':
      return await listerProjetsPourCaisseDesDépôts(args)
    case 'porteur-projet':
      return await listerProjetsPourPorteur(args)
    default:
      return makePaginatedList([], 0, pagination)
  }
}
