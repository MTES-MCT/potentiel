import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { RolesPourCatégoriesPermission } from './donnéesProjetParCatégorie'
import { getListeColonnesExportParRole } from './getListeColonnesExportParRole'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'

export const exporterProjets = ({
  role,
  filtres,
}: {
  role: RolesPourCatégoriesPermission
  filtres?: FiltreListeProjets
}) => {
  const listeColonnes = getListeColonnesExportParRole({
    role,
  })

  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return getProjetsListePourDGEC({ listeColonnes, filtres }).map((données) => ({
        colonnes: listeColonnes.map((c) => (c.details ? c.champ : c.intitulé)),
        données,
      }))
  }
}
