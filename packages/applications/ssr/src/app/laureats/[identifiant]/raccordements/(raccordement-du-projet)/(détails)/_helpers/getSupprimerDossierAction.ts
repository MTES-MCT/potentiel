import type { Role } from '@potentiel-domain/utilisateur';

type GetSupprimerDossierAction = (args: {
  rôle: Role.ValueType;
  estAchevé: boolean;
  dossierEstEnService: boolean;
}) => boolean;

export const getSupprimerDossierAction: GetSupprimerDossierAction = ({
  rôle,
  estAchevé,
  dossierEstEnService,
}) => {
  if (dossierEstEnService) {
    return rôle.aLaPermission('raccordement.dossier.supprimer-après-mise-en-service');
  }

  if (estAchevé) {
    return rôle.aLaPermission('raccordement.dossier.supprimer-après-achèvement');
  }

  return rôle.aLaPermission('raccordement.dossier.supprimer');
};
