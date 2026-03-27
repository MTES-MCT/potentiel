import { DocumentProjet } from '#document-projet';

export const attestationConformité = DocumentProjet.documentFactory(
  'achevement/attestation-conformite',
  'attestation-conformite',
  'enregistréLe',
);

export const attestationConformitéModification = DocumentProjet.documentFactory(
  'achevement/attestation-conformite',
  'attestation-conformite',
  'modifiéLe',
);

export const preuveTransmissionAttestationConformité = DocumentProjet.documentFactory(
  'achevement/preuve-transmission-attestation-conformite',
  'preuve-transmission-attestation-conformite',
  'enregistréLe',
);
export const preuveTransmissionAttestationConformitéModification = DocumentProjet.documentFactory(
  'achevement/preuve-transmission-attestation-conformite',
  'preuve-transmission-attestation-conformite',
  'modifiéLe',
);
