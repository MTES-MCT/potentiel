import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = `${string}#${string}#${string}#${string}`;

export type ValueType = ReadonlyValueType<{
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  formatter(): RawType;
}>;

export const convertirEnValueType = (identifiantProjet: string): ValueType => {
  estValide(identifiantProjet);

  const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

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

const regexIdentifiantProjet = /^[^#]+#[^#]+#([^#]+)?#[^#]+$/;

function estValide(value: string): asserts value is RawType {
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
