import {
  catégoriesPermissionsParRôle,
  donnéesProjetParCatégorie,
  RolesPourCatégoriesPermission,
} from './donnéesProjetParCatégorie'

export const getListeColonnesExportParRole = ({
  role,
}: {
  role: RolesPourCatégoriesPermission
}) => {
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
