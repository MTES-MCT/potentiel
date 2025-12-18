import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export const getModificationPTFAction = (
  rôle: Role.ValueType,
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel,
) => {
  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

  if (dossierEnService) {
    return rôle.aLaPermission(
      'raccordement.proposition-technique-et-financière.modifier-après-mise-en-service',
    );
  }

  return rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier');
};
