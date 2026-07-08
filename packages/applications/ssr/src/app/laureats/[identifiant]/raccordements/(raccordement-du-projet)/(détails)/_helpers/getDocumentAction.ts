import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../(dossier-de-raccordement)/components/DossierRaccordement';

type GetDocumentActionProps = {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  type?: Lauréat.Raccordement.TypeDocumentsRaccordement.RawType;
  estProjetAchevé: boolean;
};

export const getDocumentAction = ({
  rôle,
  dossier,
  estProjetAchevé,
  type,
}: GetDocumentActionProps): DossierEtapeAction => {
  const label = type ? `Transmettre la ${type.split('-').join(' ')}` : 'Transmettre le document';

  const transmettreAction = {
    href: Routes.Raccordement.document.transmettre(
      dossier.identifiantProjet.formatter(),
      dossier.référence.formatter(),
    ),
    label,
  };

  if (!type) {
    return rôle.aLaPermission('raccordement.document-raccordement.transmettre')
      ? transmettreAction
      : undefined;
  }

  const modifierAction = {
    href: Routes.Raccordement.document.modifier(
      dossier.identifiantProjet.formatter(),
      dossier.référence.formatter(),
      type,
    ),
    label: 'Modifier',
  };

  if (!dossier[Lauréat.Raccordement.TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(type)]) {
    if (rôle.aLaPermission('raccordement.document-raccordement.transmettre')) {
      return transmettreAction;
    }
    return undefined;
  }

  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

  if (
    dossierEnService &&
    rôle.aLaPermission('raccordement.document-raccordement.modifier-après-mise-en-service')
  ) {
    return modifierAction;
  }

  if (
    estProjetAchevé &&
    rôle.aLaPermission('raccordement.document-raccordement.modifier-après-achèvement')
  ) {
    return modifierAction;
  }

  if (rôle.aLaPermission('raccordement.document-raccordement.modifier')) {
    return modifierAction;
  }
};
