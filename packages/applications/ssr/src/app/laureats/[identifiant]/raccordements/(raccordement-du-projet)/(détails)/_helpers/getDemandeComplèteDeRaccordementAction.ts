import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../(dossier-de-raccordement)/components/DossierRaccordement';

type GetDemandeComplèteDeRaccordementActionProps = {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  estProjetAchevé: boolean;
};

export const getDemandeComplèteDeRaccordementAction = ({
  rôle,
  dossier,
  estProjetAchevé,
}: GetDemandeComplèteDeRaccordementActionProps): Array<DossierEtapeAction> => {
  const actions = rôle.aLaPermission('raccordement.référence-dossier.modifier')
    ? [
        {
          label: 'Corriger la référence du dossier',
          href: Routes.Raccordement.corrigerRéférenceDossier(
            dossier.identifiantProjet.formatter(),
            dossier.référence.formatter(),
          ),
        },
      ]
    : [];

  if (
    rôle.aLaPermission('raccordement.référence-dossier.modifier') &&
    !rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier')
  ) {
    return actions;
  }

  const modifierAction = {
    href: Routes.Raccordement.modifierDemandeComplèteRaccordement(
      dossier.identifiantProjet.formatter(),
      dossier.référence.formatter(),
    ),
    label: 'Modifier',
  };

  const dossierEstEnService = !!dossier.dateMiseEnService;

  const dossierAvecDCRComplète = !!(
    dossier.demandeComplèteRaccordement?.dateQualification &&
    dossier.demandeComplèteRaccordement?.accuséRéception?.format
  );

  if (
    !estProjetAchevé &&
    !dossierEstEnService &&
    rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier')
  ) {
    actions.push(modifierAction);
  }

  if (
    dossierEstEnService &&
    dossierAvecDCRComplète &&
    rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier-après-mise-en-service')
  ) {
    actions.push(modifierAction);
  }

  if (
    estProjetAchevé &&
    rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier-après-achèvement')
  ) {
    actions.push(modifierAction);
  }

  return actions;
};
