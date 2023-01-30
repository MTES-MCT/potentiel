import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { exporterProjetsPourDGEC } from './requêtes/exporterProjetsPourDGEC'
import { exporterProjetsPourCaisseDesDépôts } from './requêtes/exporterProjetsPourCaisseDesDépôts'

export const exporterProjets = ({
  role,
  filtres,
}: {
  role: 'admin' | 'dgec-validateur' | 'caisse-des-dépôts'
  filtres?: FiltreListeProjets
}) => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return exporterProjetsPourDGEC({ filtres })
    case 'caisse-des-dépôts':
      return exporterProjetsPourCaisseDesDépôts({ filtres })
  }
}
