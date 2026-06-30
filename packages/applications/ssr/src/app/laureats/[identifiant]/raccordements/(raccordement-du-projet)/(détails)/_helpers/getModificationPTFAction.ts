import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../test/(raccordement-du-projet)/Dossier';

type GetModificationPTFAction = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  statutLauréat: Lauréat.StatutLauréat.ValueType;
}) => boolean;

export const getModificationPTFAction: GetModificationPTFAction = ({
  rôle,
  dossier,
  statutLauréat,
}) => {
  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

  if (dossierEnService) {
    return rôle.aLaPermission(
      'raccordement.proposition-technique-et-financière.modifier-après-mise-en-service',
    );
  }

  if (statutLauréat.estAchevé()) {
    return rôle.aLaPermission(
      'raccordement.proposition-technique-et-financière.modifier-après-achèvement',
    );
  }

  return rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier');
};

// TODO: intégrer la notion de document de raccordement
type GetPropositionTechniqueEtFinancièreAction = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  estProjetAchevé: boolean;
}) => DossierEtapeAction;

export const getPropositionTechniqueEtFinancièreAction: GetPropositionTechniqueEtFinancièreAction =
  ({ rôle, dossier, estProjetAchevé }) => {
    const action = {
      href: Routes.Raccordement.modifierPropositionTechniqueEtFinancière(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
      ),
      label: 'Modifier',
    };
    const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

    if (
      dossierEnService &&
      rôle.aLaPermission(
        'raccordement.proposition-technique-et-financière.modifier-après-mise-en-service',
      )
    ) {
      return action;
    }

    if (
      estProjetAchevé &&
      rôle.aLaPermission(
        'raccordement.proposition-technique-et-financière.modifier-après-achèvement',
      )
    ) {
      return action;
    }

    if (rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier')) {
      return action;
    }
  };
