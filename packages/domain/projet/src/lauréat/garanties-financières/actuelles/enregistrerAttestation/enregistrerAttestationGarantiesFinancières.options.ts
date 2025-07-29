import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type EnregistrerAttestationOptions = {
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: IdentifiantUtilisateur.ValueType;
};
