import type { IdentifiantProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';

import { getÉliminé } from './getÉliminé';
import { getLauréatInfos } from './lauréat';

type GetProjetLauréatOuÉliminéResult =
  | {
      lauréat: Lauréat.ConsulterLauréatReadModel;
      éliminé?: undefined;
    }
  | {
      éliminé: Éliminé.ConsulterÉliminéReadModel;
      lauréat?: undefined;
    };

// dans le cas d'un recours accordé, le projet devient lauréat
type GetProjetLauréatOuÉliminé = (
  identifiantProjet: IdentifiantProjet.RawType,
) => Promise<GetProjetLauréatOuÉliminéResult>;

export const getProjetLauréatOuÉliminé: GetProjetLauréatOuÉliminé = async (
  identifiantProjet,
): Promise<GetProjetLauréatOuÉliminéResult> => {
  const éliminé = await getÉliminé(identifiantProjet);

  if (éliminé) {
    return { éliminé };
  }

  const lauréat = await getLauréatInfos(identifiantProjet);

  return { lauréat };
};
