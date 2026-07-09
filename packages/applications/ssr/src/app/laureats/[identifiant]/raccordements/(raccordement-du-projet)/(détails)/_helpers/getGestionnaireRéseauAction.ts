import { Routes } from '@potentiel-applications/routes';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../(dossier-de-raccordement)/components/DossierRaccordement';

type Props = {
  rôle: Role.ValueType;
  estProjetAchevé: boolean;
  estInconnuGestionnaire: boolean;
  aUnDossierEnService: boolean;
  identifiantProjet: IdentifiantProjet.RawType;
};

export const getGestionnaireRéseauAction = ({
  rôle,
  estProjetAchevé,
  estInconnuGestionnaire,
  aUnDossierEnService,
  identifiantProjet,
}: Props): DossierEtapeAction | undefined => {
  if (
    aUnDossierEnService &&
    rôle.aLaPermission('raccordement.gestionnaire.modifier-après-mise-en-service')
  ) {
    return {
      label: estInconnuGestionnaire ? 'Renseigner' : 'Modifier',
      href: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet),
    };
  }

  if (
    estProjetAchevé &&
    !estInconnuGestionnaire &&
    rôle.aLaPermission('raccordement.gestionnaire.modifier-après-achèvement')
  ) {
    return {
      label: 'Modifier',
      href: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet),
    };
  }

  if (rôle.aLaPermission('raccordement.gestionnaire.modifier'))
    return {
      label: estInconnuGestionnaire ? 'Renseigner' : 'Modifier',
      href: Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet),
    };
};
