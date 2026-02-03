import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

type GetModificationPTFAction = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  statutLauréat: Lauréat.StatutLauréat.ValueType;
}) => boolean;

export const getModificationPTFAction: GetModificationPTFAction = ({
  rôle,
  dossier,
  statutLauréat,
}) => {
  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

  if (dossierEnService) {
    return rôle.aLaPermission(
      'raccordement.proposition-technique-et-financière.modifier-après-mise-en-service',
    );
  }

  if (statutLauréat.estAchevé()) {
    return rôle.aLaPermission(
      'raccordement.proposition-technique-et-financière.modifier-après-achèvement',
    );
  }

  return rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier');
};
