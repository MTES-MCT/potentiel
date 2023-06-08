import { Option, isNone, none } from '@potentiel/monads';

export type RawIdentifiantProjet = `${string}#${string}#${string}#${string}`;

export type IdentifiantProjet = {
  appelOffre: string;
  période: string;
  famille: Option<string>;
  numéroCRE: string;
};

export type IdentifiantProjetValueType = IdentifiantProjet & {
  formatter: () => RawIdentifiantProjet;
};

export const convertirEnIdentifiantProjet = (
  identifiantProjet: string | IdentifiantProjet,
): IdentifiantProjetValueType => {
  if (typeof identifiantProjet === 'string') {
    const [appelOffre, période, famille, numéroCRE] = identifiantProjet.split('#');

    return {
      appelOffre,
      période,
      famille: !famille ? none : famille,
      numéroCRE,
      formatter() {
        return `${appelOffre}#${période}#${famille}#${numéroCRE}`;
      },
    };
  }

  const { appelOffre, famille, numéroCRE, période } = identifiantProjet;

  return {
    appelOffre,
    famille,
    numéroCRE,
    période,
    formatter() {
      return `${appelOffre}#${période}#${isNone(famille) ? '' : famille}#${numéroCRE}`;
    },
  };
};
