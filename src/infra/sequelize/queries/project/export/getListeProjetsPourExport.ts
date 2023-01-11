import { RolesPourCatégoriesPermission } from '@modules/project/queries/exporterProjets'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'
import { FiltreListeProjets } from './mapToFindOptions'

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
