import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

type GetSupprimerDossierAction = (args: {
  rôle: Role.ValueType;
  statutLauréat: Lauréat.StatutLauréat.ValueType;
  dossierEnService: boolean;
}) => boolean;

export const getSupprimerDossierAction: GetSupprimerDossierAction = ({
  rôle,
  statutLauréat,
  dossierEnService,
}) => {
  if (dossierEnService) {
    return rôle.aLaPermission('raccordement.dossier.supprimer-après-mise-en-service');
  }

  if (statutLauréat.estAchevé()) {
    return rôle.aLaPermission('raccordement.dossier.supprimer-après-achèvement');
  }

  return rôle.aLaPermission('raccordement.dossier.supprimer');
};
