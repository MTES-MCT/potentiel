import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DossierEtapeAction } from '../../../test/(raccordement-du-projet)/Dossier';

type GetModificationDCRAction = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  statutLauréat: Lauréat.StatutLauréat.ValueType;
}) => boolean;

export const getModificationDCRAction: GetModificationDCRAction = ({
  rôle,
  dossier,
  statutLauréat,
}) => {
  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;
  const dossierAvecDCRComplète = !!(
    dossier.demandeComplèteRaccordement?.dateQualification &&
    dossier.demandeComplèteRaccordement?.accuséRéception?.format
  );

  if (dossierEnService && dossierAvecDCRComplète) {
    return rôle.aLaPermission(
      'raccordement.demande-complète-raccordement.modifier-après-mise-en-service',
    );
  }

  if (statutLauréat.estAchevé()) {
    return rôle.aLaPermission(
      'raccordement.demande-complète-raccordement.modifier-après-achèvement',
    );
  }

  return rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier');
};

type GetDemandeComplèteDeRaccordementActionTest = (args: {
  rôle: Role.ValueType;
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  estProjetAchevé: boolean;
}) => DossierEtapeAction;

export const getDemandeComplèteDeRaccordementActionTest: GetDemandeComplèteDeRaccordementActionTest =
  ({ rôle, dossier, estProjetAchevé }) => {
    if (
      rôle.aLaPermission('raccordement.référence-dossier.modifier') &&
      !rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier')
    ) {
      return {
        label: 'Corriger la référence du dossier',
        href: Routes.Raccordement.corrigerRéférenceDossier(
          dossier.identifiantProjet.formatter(),
          dossier.référence.formatter(),
        ),
      };
    }

    const dossierEstEnService = !!dossier.miseEnService?.dateMiseEnService?.date;
    const dossierAvecDCRComplète = !!(
      dossier.demandeComplèteRaccordement?.dateQualification &&
      dossier.demandeComplèteRaccordement?.accuséRéception?.format
    );

    const modifierAction = {
      href: Routes.Raccordement.modifierDemandeComplèteRaccordement(
        dossier.identifiantProjet.formatter(),
        dossier.référence.formatter(),
      ),
      label: 'Modifier',
    };

    if (
      dossierEstEnService &&
      dossierAvecDCRComplète &&
      rôle.aLaPermission(
        'raccordement.demande-complète-raccordement.modifier-après-mise-en-service',
      )
    ) {
      return modifierAction;
    }

    if (
      estProjetAchevé &&
      rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier-après-achèvement')
    ) {
      return modifierAction;
    }

    if (rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier'))
      return modifierAction;
  };
