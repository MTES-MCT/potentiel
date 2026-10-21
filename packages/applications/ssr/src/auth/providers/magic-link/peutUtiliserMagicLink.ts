import type { Utilisateur } from '@potentiel-domain/utilisateur';
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

  return profilEstActif;
};
