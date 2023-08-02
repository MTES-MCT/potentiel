import { DateConstitutionGarantiesFinancièreDansLeFuturErreur } from '../projet.error';
import { AttestationConstitution } from './garantiesFinancières.valueType';

export const verifyGarantiesFinancièresAttestationForCommand = ({
  date,
}: AttestationConstitution) => {
  if (date.estDansLeFutur()) {
    throw new DateConstitutionGarantiesFinancièreDansLeFuturErreur();
  }
  return;
};
