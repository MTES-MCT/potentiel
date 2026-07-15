import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../(dossier-de-raccordement)/components/DossierRaccordement';

type GetMiseEnServiceAction = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
}) => DossierEtapeAction;

export const getMiseEnServiceAction: GetMiseEnServiceAction = ({ rôle, dossier }) => {
  if (dossier.dateMiseEnService) {
    return rôle.aLaPermission('raccordement.date-mise-en-service.modifier')
      ? {
          href: Routes.Raccordement.modifierDateMiseEnService(
            dossier.identifiantProjet.formatter(),
            dossier.référence.formatter(),
          ),
          label: 'Modifier',
        }
      : undefined;
  }

  return rôle.aLaPermission('raccordement.date-mise-en-service.transmettre')
    ? {
        href: Routes.Raccordement.transmettreDateMiseEnService(
          dossier.identifiantProjet.formatter(),
          dossier.référence.formatter(),
        ),
        label: 'Transmettre la date de mise en service',
      }
    : undefined;
};
