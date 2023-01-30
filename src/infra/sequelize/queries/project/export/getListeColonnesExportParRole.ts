import { UserRole } from '@modules/users'
import {
  catégoriesPermissionsParRôle,
  donnéesProjetParCatégorie,
} from './donnéesProjetParCatégorie'

export const getListeColonnesExportParRole = ({ role }: { role: UserRole }) => {
  const catégoriesDuRôle = catégoriesPermissionsParRôle[role]

  return catégoriesDuRôle.reduce((listeColonnes, catégorie) => {
    const nouvellesColonnes = Object.entries(donnéesProjetParCatégorie).filter(
      ([clé, valeur]) => clé === catégorie && valeur
    )
    return nouvellesColonnes[0] && nouvellesColonnes[0][1] !== undefined
      ? [...listeColonnes, ...nouvellesColonnes[0][1]]
      : listeColonnes
  }, [])
}
