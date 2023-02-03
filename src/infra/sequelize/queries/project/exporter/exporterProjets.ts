import { FiltreListeProjets } from '@modules/project'
import { exporterProjetsPourDGEC } from './requêtes/exporterProjetsPourDGEC'
import { exporterProjetsPourCRE } from './requêtes/exporterProjetsPourCRE'
import { exporterProjetsPourCaisseDesDépôts } from './requêtes/exporterProjetsPourCaisseDesDépôts'
import { exporterProjetsPourPorteurDeProjet } from './requêtes/exporterProjetsPourPorteurDeProjet'
import { exporterProjetsPourDREAL } from './requêtes/exporterProjetsPourDREAL'
import { User } from '@entities'
import { errAsync } from 'neverthrow'
import { UnauthorizedError } from '@modules/shared'

export const exporterProjets = ({
  user,
  filtres,
}: {
  user: User
  filtres?: FiltreListeProjets
}) => {
  switch (user.role) {
    case 'admin':
    case 'dgec-validateur':
      return exporterProjetsPourDGEC({ filtres })
    case 'cre':
      return exporterProjetsPourCRE({ filtres })
    case 'caisse-des-dépôts':
      return exporterProjetsPourCaisseDesDépôts({ filtres })
    case 'porteur-projet':
      return exporterProjetsPourPorteurDeProjet({ user, filtres })
    case 'dreal':
      return exporterProjetsPourDREAL({ user, filtres })
    default:
      return errAsync(new UnauthorizedError())
  }
}
