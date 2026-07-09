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
}: GetDocumentActionProps): Array<DossierEtapeAction> => {
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
      ? [transmettreAction]
      : [];
  }

  const modifierActions = [
    {
      href: Routes.Raccordement.document.modifier(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
        type,
      ),
      label: 'Modifier le document',
    },
    {
      href: '',
      typeDocument: type,
      label: 'Supprimer le document',
    },
  ];

  const dossierNeContientPasCeTypeDeDocument =
    !dossier[Lauréat.Raccordement.TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(type)];

  if (dossierNeContientPasCeTypeDeDocument) {
    return rôle.aLaPermission('raccordement.document-raccordement.transmettre')
      ? [transmettreAction]
      : [];
  }

  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

  if (
    dossierEnService &&
    rôle.aLaPermission('raccordement.document-raccordement.modifier-après-mise-en-service')
  ) {
    return modifierActions;
  }

  if (
    estProjetAchevé &&
    rôle.aLaPermission('raccordement.document-raccordement.modifier-après-achèvement')
  ) {
    return modifierActions;
  }

  if (rôle.aLaPermission('raccordement.document-raccordement.modifier')) {
    return modifierActions;
  }

  return [];
};
