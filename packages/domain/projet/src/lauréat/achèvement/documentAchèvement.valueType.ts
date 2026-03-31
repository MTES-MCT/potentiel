import { DocumentProjet } from '#document-projet';

const domaine = 'achevement';

export const attestationConformité = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'attestation-conformite',
  nomChampDocument: 'attestation-conformite',
  nomChampDate: 'enregistréLe',
});

export const preuveTransmissionAttestationConformité = DocumentProjet.documentFactory({
  domaine,
  typeDocument: 'preuve-transmission-attestation-conformite',
  nomChampDocument: 'preuve-transmission-attestation-conformite',
  nomChampDate: 'enregistréLe',
});
