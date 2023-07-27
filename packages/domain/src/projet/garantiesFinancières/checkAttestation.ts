import { DateConstitutionGarantiesFinancièreDansLeFuturErreur } from '../projet.error';
import { AttestationConstitution } from '../projet.valueType';

export const checkAttestation = ({ date }: AttestationConstitution) => {
  if (date.estDansLeFutur()) {
    throw new DateConstitutionGarantiesFinancièreDansLeFuturErreur();
  }
  return;
};
