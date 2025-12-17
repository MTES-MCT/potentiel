import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export const getModificationPTFAction = (
  rôle: Role.ValueType,
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel,
) => {
  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

  if (!rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier')) {
    return false;
  }

  if (rôle.estDGEC()) {
    return true;
  }

  if (!dossierEnService) {
    return true;
  }

  return false;
};
