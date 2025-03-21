import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

type AppelOffre = string;
type Période = string;
type Famille = string;
type NuméroCRE = string;

/**
 * @deprecated use potentiel-domain/projet
 */
export type RawType = `${AppelOffre}#${Période}#${Famille}#${NuméroCRE}`;

/**
 * @deprecated use potentiel-domain/projet
 */
export type ValueType = ReadonlyValueType<{
  appelOffre: AppelOffre;
  période: Période;
  famille: Famille;
  numéroCRE: NuméroCRE;
  formatter(): RawType;
}>;

/**
 * @deprecated use potentiel-domain/projet
 */
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

/**
 * @deprecated use potentiel-domain/projet
 */
export const convertirEnValueType = (identifiantProjet: string): ValueType => {
  if (!estValide(identifiantProjet)) {
    throw new IdentifiantProjetInvalideError(identifiantProjet);
  }

  const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

  return bind({
    appelOffre,
    période,
    famille,
    numéroCRE,
  });
};

const regexIdentifiantProjet = /^[^#]+#[^#]+#([^#]+)?#[^#]+$/;

/**
 * @deprecated use potentiel-domain/projet
 */
export function estValide(value: string) {
  return regexIdentifiantProjet.test(value);
}

/**
 * @deprecated use potentiel-domain/projet
 */
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
