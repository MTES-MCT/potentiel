import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import {
  catégoriesPermissionsParRôle,
  donnéesProjetParCatégorie,
  RolesPourCatégoriesPermission,
} from './donnéesProjetParCatégorie'
import { getListeColonnesExportParRole } from './getListeColonnesExportParRole'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'

export const exporterProjets = ({
  role,
  filtres,
}: {
  role: RolesPourCatégoriesPermission
  listeColonnes: string[]
  filtres?: FiltreListeProjets
}) => {
  const listeColonnes = getListeColonnesExportParRole({
    role,
    donnéesProjetParCatégorie,
    catégoriesPermissionsParRôle,
  })
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return getProjetsListePourDGEC({ listeColonnes, filtres })
  }
}
