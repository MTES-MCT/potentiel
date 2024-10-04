import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

type AppelOffre = string;
type Période = string;
type Famille = string;
type NuméroCRE = string;

export type RawType = `${AppelOffre}#${Période}#${Famille}#${NuméroCRE}`;

export type ValueType = ReadonlyValueType<{
  appelOffre: AppelOffre;
  période: Période;
  famille: Famille;
  numéroCRE: NuméroCRE;
  formatter(): RawType;
}>;

export const bind = ({
  appelOffre,
  famille,
  numéroCRE,
  période,
}: PlainType<ValueType>): ValueType => {
  return {
    appelOffre,
    période,
    famille,
    numéroCRE,
    formatter() {
      return `${this.appelOffre}#${this.période}#${this.famille}#${this.numéroCRE}`;
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
  };
};

export const convertirEnValueType = (identifiantProjet: string): ValueType => {
  estValide(identifiantProjet);

  const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

  return bind({
    appelOffre,
    période,
    famille,
    numéroCRE,
  });
};

const regexIdentifiantProjet = /^[^#]+#[^#]+#([^#]+)?#[^#]+$/;

export function estValide(value: string): asserts value is RawType {
  const isValid = regexIdentifiantProjet.test(value);

  if (!isValid) {
    throw new IdentifiantProjetInvalideError(value);
  }
}

export const inconnu = convertirEnValueType(
  'appelOffreInconnu#périodeInconnu#familleInconnu#numéroCREInconnu',
);

class IdentifiantProjetInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `L'identifiant projet ne correspond pas au format suivant: '{appel offre}#{période}#{famille}#{numéro CRE}'`,
      {
        value,
      },
    );
  }
}
