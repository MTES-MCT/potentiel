import { FiltreListeProjets } from '@modules/project'
import { exporterProjetsPourDGEC } from './requêtes/exporterProjetsPourDGEC'
import { exporterProjetsPourCRE } from './requêtes/exporterProjetsPourCRE'
import { exporterProjetsPourCaisseDesDépôts } from './requêtes/exporterProjetsPourCaisseDesDépôts'

export const exporterProjets = ({
  role,
  filtres,
}: {
  role: 'admin' | 'dgec-validateur' | 'caisse-des-dépôts' | 'cre'
  filtres?: FiltreListeProjets
}) => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return exporterProjetsPourDGEC({ filtres })
    case 'cre':
      return exporterProjetsPourCRE({ filtres })
    case 'caisse-des-dépôts':
      return exporterProjetsPourCaisseDesDépôts({ filtres })
  }
}
