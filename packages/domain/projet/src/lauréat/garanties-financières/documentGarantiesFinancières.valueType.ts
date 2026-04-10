import { join } from 'path';

import { DocumentProjet, DossierProjet } from '#document-projet';

const domaine = 'garanties-financieres';

const typeAttestationSoumise = 'attestation-garanties-financieres-soumises';
const typeAttestationActuelle = 'attestation-garanties-financieres';

export const dossierProjetGarantiesFinancières = (identifiantProjet: string) => ({
  attestationGarantiesFinancièresDépôt: DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument: join(domaine, typeAttestationSoumise),
  }),
  attestationGarantiesFinancières: DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument: join(domaine, typeAttestationActuelle),
  }),
});

export const attestationSoumise = DocumentProjet.documentFactory({
  domaine,
  typeDocument: typeAttestationSoumise,
  nomChampDate: 'dateConstitution',
  nomChampDocument: 'attestation',
});

export const attestationActuelle = DocumentProjet.documentFactory({
  domaine,
  typeDocument: typeAttestationActuelle,
  nomChampDate: 'dateConstitution',
  nomChampDocument: 'attestation',
});
