import { User } from '@entities'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { getListeColonnesExportParRole } from './getListeColonnesExportParRole'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'
import { getProjetsListePourDREAL } from './getListeProjetsPourDREAL'

export const exporterProjets = ({
  user,
  filtres,
}: {
  user: User
  filtres?: FiltreListeProjets
}) => {
  const listeColonnes = getListeColonnesExportParRole({
    role: user.role,
  })

  switch (user.role) {
    case 'admin':
    case 'dgec-validateur':
      return getProjetsListePourDGEC({ listeColonnes, filtres }).map((données) => ({
        colonnes: listeColonnes.map((c) => (c.details ? c.champ : c.intitulé)),
        données,
      }))
    case 'dreal':
      return getProjetsListePourDREAL({ listeColonnes, filtres, user }).map((données) => ({
        colonnes: listeColonnes.map((c) => (c.details ? c.champ : c.intitulé)),
        données,
      }))
  }
}
