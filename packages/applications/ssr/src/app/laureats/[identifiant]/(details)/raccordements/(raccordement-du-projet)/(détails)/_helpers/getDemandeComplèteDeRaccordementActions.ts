import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../(dossier-de-raccordement)/components/DossierRaccordement';

type GetDemandeComplèteDeRaccordementActionsProps = {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  estProjetAchevé: boolean;
};

type État = 'enCours' | 'enService' | 'projetAchevé';

const getÉtatDossier = (dossierEstEnService: boolean, projetEstAchevé: boolean): État =>
  projetEstAchevé ? 'projetAchevé' : dossierEstEnService ? 'enService' : 'enCours';

const permissionModifierRéférenceDossierParÉtat: Record<État, Role.Policy> = {
  enCours: 'raccordement.référence-dossier.modifier',
  enService: 'raccordement.référence-dossier.modifier-après-mise-en-service',
  projetAchevé: 'raccordement.référence-dossier.modifier-après-achèvement',
};

const permissionModifierDCRParÉtat: Record<État, Role.Policy> = {
  enCours: 'raccordement.demande-complète-raccordement.modifier',
  enService: 'raccordement.demande-complète-raccordement.modifier-après-mise-en-service',
  projetAchevé: 'raccordement.demande-complète-raccordement.modifier-après-achèvement',
};

export const getDemandeComplèteDeRaccordementActions = ({
  rôle,
  dossier,
  estProjetAchevé,
}: GetDemandeComplèteDeRaccordementActionsProps): Array<DossierEtapeAction> => {
  const état = getÉtatDossier(!!dossier.dateMiseEnService, estProjetAchevé);
  const actions: Array<DossierEtapeAction> = [];

  if (rôle.aLaPermission(permissionModifierRéférenceDossierParÉtat[état])) {
    actions.push({
      label: 'Corriger la référence du dossier',
      href: Routes.Raccordement.corrigerRéférenceDossier(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
      ),
    });
  }

  if (rôle.aLaPermission(permissionModifierDCRParÉtat[état])) {
    actions.push({
      href: Routes.Raccordement.modifierDemandeComplèteRaccordement(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
      ),
      label: 'Modifier',
    });
  }

  return actions;
};
