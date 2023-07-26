import { Option, isNone, none } from '@potentiel/monads';
import { DateTimeValueType } from '../common.valueType';

export type AttestationGarantiesFinancières = {
  format: string;
  dateConstitution: DateTimeValueType;
};

type TypeAccepté =
  | `avec date d'échéance`
  | 'type inconnu'
  | `consignation`
  | `6 mois après achèvement`;
export type TypeGarantiesFinancières = {
  type: TypeAccepté;
  dateÉchéance?: DateTimeValueType;
};

export type GarantiesFinancières = Partial<TypeGarantiesFinancières> & {
  attestation?: AttestationGarantiesFinancières;
};

export const estUnTypeDeGarantiesFinancièresAccepté = (value: any): value is TypeAccepté =>
  value === `avec date d'échéance` ||
  value === 'type inconnu' ||
  value === `consignation` ||
  value === `6 mois après achèvement`;

export type RawIdentifiantProjet = `${string}#${string}#${string}#${string}`;

export type IdentifiantProjet = {
  appelOffre: string;
  période: string;
  famille: Option<string>;
  numéroCRE: string;
};

export type IdentifiantProjetValueType = IdentifiantProjet & {
  formatter(): RawIdentifiantProjet;
};

export const convertirEnIdentifiantProjet = (
  identifiantProjet: RawIdentifiantProjet | IdentifiantProjet,
): IdentifiantProjetValueType => {
  // TODO: ajout validation
  return {
    ...(estUnIdentifiantProjet(identifiantProjet)
      ? identifiantProjet
      : convertirRawIdentifiantProjet(identifiantProjet)),
    formatter() {
      return `${this.appelOffre}#${this.période}#${isNone(this.famille) ? '' : this.famille}#${
        this.numéroCRE
      }`;
    },
  };
};

const convertirRawIdentifiantProjet = (rawIdentifiant: RawIdentifiantProjet): IdentifiantProjet => {
  const [appelOffre, période, famille, numéroCRE] = rawIdentifiant.split('#');

  return {
    appelOffre,
    période,
    famille: !famille ? none : famille,
    numéroCRE,
  };
};

export const estUnIdentifiantProjet = (value: any): value is IdentifiantProjet => {
  return (
    typeof value.appelOffre === 'string' &&
    typeof value.numéroCRE === 'string' &&
    typeof value.période === 'string' &&
    (value.famille === none || typeof value.famille === 'string')
  );
};

export const estUnRawIdentifiantProjet = (value: string): value is RawIdentifiantProjet => {
  const [appelOffre, période, famille, numéroCRE] = value.split('#');

  return (
    typeof appelOffre === 'string' &&
    typeof numéroCRE === 'string' &&
    typeof période === 'string' &&
    typeof famille === 'string'
  );
};
