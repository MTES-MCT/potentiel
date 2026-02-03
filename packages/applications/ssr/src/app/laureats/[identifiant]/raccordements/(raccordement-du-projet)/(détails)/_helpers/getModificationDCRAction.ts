import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

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
