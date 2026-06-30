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
    const transmettreAction = {
      href: Routes.Raccordement.transmettrePropositionTechniqueEtFinancière(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
      ),
      label: 'Transmettre la proposition technique et financière',
    };
    const modifierAction = {
      href: Routes.Raccordement.modifierPropositionTechniqueEtFinancière(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
      ),
      label: 'Modifier',
    };

    if (!dossier.propositionTechniqueEtFinancière) {
      if (rôle.aLaPermission('raccordement.proposition-technique-et-financière.transmettre')) {
        return transmettreAction;
      }
      return undefined;
    }

    const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;

    if (
      dossierEnService &&
      rôle.aLaPermission(
        'raccordement.proposition-technique-et-financière.modifier-après-mise-en-service',
      )
    ) {
      return modifierAction;
    }

    if (
      estProjetAchevé &&
      rôle.aLaPermission(
        'raccordement.proposition-technique-et-financière.modifier-après-achèvement',
      )
    ) {
      return modifierAction;
    }

    if (rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier')) {
      return modifierAction;
    }
  };
