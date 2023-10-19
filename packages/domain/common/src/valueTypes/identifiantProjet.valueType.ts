import { InvalidOperationError } from '@potentiel-domain/core';

export type RawType = `${string}#${string}#${string}#${string}`;

export type ValueType = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  formatter(): RawType;
};

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
  };
};

const regexIdentifiantProjet = /^[^#]+#[^#]+#[^#]+#[^#]+$/;

function estValide(value: string): asserts value is RawType {
  const isValid = regexIdentifiantProjet.test(value);

  if (!isValid) {
    throw new IdentifiantProjetInvalideError(value);
  }
}

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
