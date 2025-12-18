import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export const getModificationDCRAction = (
  rôle: Role.ValueType,
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel,
) => {
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

  return rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier');
};
