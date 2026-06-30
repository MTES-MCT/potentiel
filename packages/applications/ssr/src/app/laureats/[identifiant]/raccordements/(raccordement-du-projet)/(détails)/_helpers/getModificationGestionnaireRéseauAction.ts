import { Routes } from '@potentiel-applications/routes';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../test/(raccordement-du-projet)/Dossier';

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

type GetGestionnaireRéseauActionTest = (args: {
  rôle: Role.ValueType;
  estProjetAchevé: boolean;
  estInconnuGestionnaire: boolean;
  aUnDossierEnService: boolean;
  identifiantProjet: IdentifiantProjet.RawType;
}) => DossierEtapeAction;

export const getGestionnaireRéseauActionTest: GetGestionnaireRéseauActionTest = ({
  rôle,
  estProjetAchevé,
  estInconnuGestionnaire,
  aUnDossierEnService,
  identifiantProjet,
}) => {
  if (
    aUnDossierEnService &&
    rôle.aLaPermission('raccordement.gestionnaire.modifier-après-mise-en-service')
  ) {
    return {
      label: estInconnuGestionnaire
        ? 'Spéficier un gestionnaire réseau'
        : 'Modifier le gestionnaire',
      href: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet),
    };
  }

  if (
    estProjetAchevé &&
    !estInconnuGestionnaire &&
    rôle.aLaPermission('raccordement.gestionnaire.modifier-après-achèvement')
  ) {
    return {
      label: 'Modifier le gestionnaire',
      href: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet),
    };
  }

  if (rôle.aLaPermission('raccordement.gestionnaire.modifier'))
    return {
      label: estInconnuGestionnaire
        ? 'Spéficier un gestionnaire réseau'
        : 'Modifier le gestionnaire',
      href: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet),
    };
};
