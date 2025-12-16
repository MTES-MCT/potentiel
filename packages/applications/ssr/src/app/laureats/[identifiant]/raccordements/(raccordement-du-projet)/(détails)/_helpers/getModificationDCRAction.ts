import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

export const getModificationDCRAction = (
  rôle: Role.ValueType,
  dossier: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel,
) => {
  const dossierEnService = !!dossier.miseEnService?.dateMiseEnService?.date;
  const dossierAvecDCRIncomplète =
    !dossier.demandeComplèteRaccordement?.dateQualification ||
    !dossier.demandeComplèteRaccordement?.accuséRéception?.format;

  if (!rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier')) {
    return false;
  }

  if (rôle.estDGEC()) {
    return true;
  }

  if (!dossierEnService) {
    return true;
  }

  if (dossierAvecDCRIncomplète) {
    return true;
  }

  return false;
};
