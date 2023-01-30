import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { getListeProjetsPourDGEC } from './getListeProjetsPourDGEC'
import { getListeProjetsPourCaisseDesDépôts } from './getListeProjetsPourCaisseDesDépôts'

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
      return getListeProjetsPourDGEC({ filtres })
    case 'caisse-des-dépôts':
      return getListeProjetsPourCaisseDesDépôts({ filtres })
  }
}
