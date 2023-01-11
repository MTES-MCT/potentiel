import { RolesPourCatégoriesPermission } from '@modules/project/queries/exporterProjets'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'

export const getListeProjetsPourExport = ({
  role,
  listeColonnes,
  filtres,
}: {
  role: RolesPourCatégoriesPermission
  listeColonnes: string[]
  filtres?: FiltreListeProjets
}) => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return getProjetsListePourDGEC({ listeColonnes, filtres })
  }
}
