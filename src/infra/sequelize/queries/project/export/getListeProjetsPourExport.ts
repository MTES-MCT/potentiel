import { RolesPourCatégoriesPermission } from '@modules/project/queries/exporterProjets'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'

export const getListeProjetsPourExport = ({
  role,
  listeColonnes,
}: {
  role: RolesPourCatégoriesPermission
  listeColonnes: string[]
}) => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return getProjetsListePourDGEC(listeColonnes)
  }
}
