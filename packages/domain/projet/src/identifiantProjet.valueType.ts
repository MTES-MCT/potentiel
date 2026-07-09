import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

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
  formatterMétier(): string;
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
    /** Le format officiel utilisé par la DGEC dans ses communications */
    formatterMétier() {
      return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
  };
};

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

export function estValide(value: string) {
  return regexIdentifiantProjet.test(value);
}

const regexIdentifiantMétier = /^(?<ao>.+)-P(?<p>\d+)(-F(?<f>\w+))?-(?<n>.+)$/;
export function estValideMétier(value: string) {
  return regexIdentifiantMétier.test(value);
}

export function depuisIdentifiantMétier(identifiantMétier: string): ValueType {
  const match = identifiantMétier.match(regexIdentifiantMétier);
  if (!match) {
    throw new IdentifiantMétierInvalideError(identifiantMétier);
  }
  const { ao, p, f, n } = match.groups ?? {};
  return bind({
    appelOffre: ao,
    période: p,
    famille: f ?? '',
    numéroCRE: n,
  });
}

export const inconnu = convertirEnValueType(
  'appelOffreInconnu#périodeInconnu#familleInconnu#numéroCREInconnu',
);

export class IdentifiantProjetInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `L'identifiant projet ne correspond pas au format suivant: '{appel offre}#{période}#{famille}#{numéro CRE}'`,
      {
        value,
      },
    );
  }
}

class IdentifiantMétierInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `L'identifiant projet ne correspond pas au format suivant: '{appel offre}-P{période}-F{famille}-{numéro CRE}'`,
      {
        value,
      },
    );
  }
}
