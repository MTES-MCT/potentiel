import { Option, isNone, none } from '@potentiel/monads';

export type RawType = `${string}#${string}#${string}#${string}`;

export type PlainType = {
  appelOffre: string;
  période: string;
  famille: Option<string>;
  numéroCRE: string;
};

export type ValueType = PlainType & {
  formatter(): RawType;
};

export const convertirEnValueType = (identifiantProjet: RawType | PlainType): ValueType => {
  // TODO: ajout validation
  return {
    ...(estUnPlainType(identifiantProjet)
      ? identifiantProjet
      : convertirEnPlainType(identifiantProjet)),
    formatter() {
      return `${this.appelOffre}#${this.période}#${isNone(this.famille) ? '' : this.famille}#${
        this.numéroCRE
      }`;
    },
  };
};

const convertirEnPlainType = (rawIdentifiant: RawType): PlainType => {
  const [appelOffre, période, famille, numéroCRE] = rawIdentifiant.split('#');

  return {
    appelOffre,
    période,
    famille: !famille ? none : famille,
    numéroCRE,
  };
};

export const estUnPlainType = (value: any): value is PlainType => {
  return (
    typeof value.appelOffre === 'string' &&
    typeof value.numéroCRE === 'string' &&
    typeof value.période === 'string' &&
    (value.famille === none || typeof value.famille === 'string')
  );
};

export const estUnRawType = (value: string): value is RawType => {
  const [appelOffre, période, famille, numéroCRE] = value.split('#');

  return (
    typeof appelOffre === 'string' &&
    typeof numéroCRE === 'string' &&
    typeof période === 'string' &&
    typeof famille === 'string'
  );
};
