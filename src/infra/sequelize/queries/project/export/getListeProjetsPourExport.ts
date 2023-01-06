import { UserRole } from '@modules/users'
import { getProjetsListePourAdmin } from './getListeProjetsPourAdmin'

export const getListeProjetsPourExport = ({
  role,
  listeColonnes,
}: {
  role: UserRole
  listeColonnes: string[]
}) => {
  switch (role) {
    case 'admin':
      return getProjetsListePourAdmin(listeColonnes)
  }
}
