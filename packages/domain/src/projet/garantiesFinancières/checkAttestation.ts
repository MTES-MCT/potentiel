import { DateConstitutionGarantiesFinancièreDansLeFuturErreur } from '../projet.error';
import { AttestationGarantiesFinancières } from '../projet.valueType';

export const checkAttestation = (
  attestationGarantiesFinancières: AttestationGarantiesFinancières,
) => {
  if (attestationGarantiesFinancières.dateConstitution.estDansLeFutur()) {
    throw new DateConstitutionGarantiesFinancièreDansLeFuturErreur();
  }
  return;
};
