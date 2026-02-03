import { Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';

type GetModificationGestionnaireRéseauAction = (args: {
  rôle: Role.ValueType;
  statutLauréat: Lauréat.StatutLauréat.ValueType;
  identifiantGestionnaireActuel: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  aUnDossierEnService: boolean;
}) => boolean;

export const getModificationGestionnaireRéseauAction: GetModificationGestionnaireRéseauAction = ({
  rôle,
  statutLauréat,
  identifiantGestionnaireActuel,
  aUnDossierEnService,
}) => {
  if (aUnDossierEnService) {
    return rôle.aLaPermission('raccordement.gestionnaire.modifier-après-mise-en-service');
  }

  if (statutLauréat.estAchevé() && !identifiantGestionnaireActuel.estInconnu()) {
    return rôle.aLaPermission('raccordement.gestionnaire.modifier-après-achèvement');
  }

  return rôle.aLaPermission('raccordement.gestionnaire.modifier');
};
