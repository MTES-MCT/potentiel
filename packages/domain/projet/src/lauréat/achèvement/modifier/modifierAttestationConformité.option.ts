import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '../../../index.js';

export type ModifierAttestationConformitéOptions = {
  modifiéePar: Email.ValueType;
  modifiéeLe: DateTime.ValueType;
  attestation: DocumentProjet.ValueType;
  estUneNouvelleAttestation: boolean;
  rapportAssocié: DocumentProjet.ValueType;
  estUnNouveauRapport: boolean;
};
