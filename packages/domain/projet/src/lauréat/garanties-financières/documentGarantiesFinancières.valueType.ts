import { DocumentProjet, DossierProjet } from '#document-projet';

const domaine = 'garanties-financieres';

const typeAttestationGarantiesFinancièresSoumises = 'attestation-garanties-financieres-soumises';
const typeAttestationGarantiesFinancières = 'attestation-garanties-financieres';

export const dossierProjetGarantiesFinancières = (identifiantProjet: string) => ({
  attestationGarantiesFinancièresDépôt: DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument: `${domaine}/${typeAttestationGarantiesFinancièresSoumises}`,
  }),
  attestationGarantiesFinancières: DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument: `${domaine}/${typeAttestationGarantiesFinancières}`,
  }),
});

export const attestationGarantiesFinancièresDépôt = DocumentProjet.documentFactory({
  domaine,
  typeDocument: typeAttestationGarantiesFinancièresSoumises,
  nomChampDate: 'soumisLe',
  nomChampDocument: 'attestation',
});

export const attestationGarantiesFinancières = DocumentProjet.documentFactory({
  domaine,
  typeDocument: typeAttestationGarantiesFinancières,
  nomChampDate: 'enregistréLe',
  nomChampDocument: 'attestation',
});
