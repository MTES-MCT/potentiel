import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../(dossier-de-raccordement)/components/Dossier';

type GetMiseEnServiceAction = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
}) => DossierEtapeAction;

export const getMiseEnServiceAction: GetMiseEnServiceAction = ({ rôle, dossier }) => {
  const transmettreAction = {
    href: Routes.Raccordement.transmettreDateMiseEnService(
      dossier.identifiantProjet.formatter(),
      dossier.référence.formatter(),
    ),
    label: 'Transmettre la proposition technique et financière',
  };
  const modifierAction = {
    href: Routes.Raccordement.modifierDateMiseEnService(
      dossier.identifiantProjet.formatter(),
      dossier.référence.formatter(),
    ),
    label: 'Modifier',
  };

  if (dossier.miseEnService?.dateMiseEnService) {
    return rôle.aLaPermission('raccordement.date-mise-en-service.transmettre')
      ? transmettreAction
      : undefined;
  }

  return rôle.aLaPermission('raccordement.date-mise-en-service.modifier')
    ? modifierAction
    : undefined;
};
