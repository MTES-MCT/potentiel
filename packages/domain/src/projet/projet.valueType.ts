import { Option, isNone, none } from '@potentiel/monads';
import { DateTimeValueType } from '../common.valueType';

type AttestationConstitutionGarantiesFinancières = {
  format: string;
  dateConstitution: DateTimeValueType;
};

type TypeEtDateEcheanceGarantiesFinancières =
  | {
      type: `6 mois après achèvement` | `consignation`;
    }
  | {
      type: `avec date d'échéance`;
      dateEcheance: DateTimeValueType;
    }
  | {
      // à terme ce cas devrait disparaître
      dateEcheance: DateTimeValueType;
    };

export type GarantiesFinancières =
  | (AttestationConstitutionGarantiesFinancières & TypeEtDateEcheanceGarantiesFinancières)
  | AttestationConstitutionGarantiesFinancières
  | TypeEtDateEcheanceGarantiesFinancières;

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
