import { Role, type Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import {
  getProfilAuthentification,
  type ProfilAuthentification,
} from '../../profilAuthentification';

export const peutUtiliserMagicLink = (
  utilisateur: Option.Type<Utilisateur.ValueType>,
  profilsActifs: Record<ProfilAuthentification, boolean>,
) => {
  if (Option.isNone(utilisateur)) {
    return true;
  }

  const profil = getProfilAuthentification(utilisateur.rôle.nom);
  const profilEstActif = profilsActifs[profil];

  /** comportement temporaire, à supprimer 22/10/2026 */
  if (!profilEstActif && !process.env.FEATURES?.match(/proconnect-partenaires/)) {
    if (utilisateur.estCocontractant() && utilisateur.zone.nom !== 'métropole') {
      return true;
    }
    const rôlesTemporairementAutorisés: Role.RawType[] = [Role.grd.nom, Role.caisseDesDépôts.nom];
    return rôlesTemporairementAutorisés.includes(utilisateur.rôle.nom);
  }

  return profilEstActif;
};
