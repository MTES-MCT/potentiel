import { mediator } from 'mediateur';

import { AchevementV1, HttpContext } from '@potentiel-applications/api-documentation';
import { Lauréat } from '@potentiel-domain/projet';

import { mapToRangeOptions } from '#helpers';

export const listerAchevementEnAttenteHandler: AchevementV1<HttpContext>['listerEnAttente'] =
  async (_, options) => {
    const { page, appelOffre, periode } = options ?? {};

    const result = await mediator.send<Lauréat.Achèvement.ListerAchèvementEnAttenteQuery>({
      type: 'Lauréat.Achèvement.Query.ListerAchèvementEnAttente',
      data: {
        appelOffre,
        periode,
        range: page
          ? mapToRangeOptions({
              currentPage: page,
              itemsPerPage: 50,
            })
          : undefined,
      },
    });

    return {
      range: result.range,
      total: result.total,
      items: result.items.map(
        ({
          identifiantProjet,
          identifiantGestionnaireReseau,
          appelOffre,
          periode,
          codePostal,
          referenceDossierRaccordement,
          dateDCR,
          prix,
          coefficientKChoisi,
        }) => ({
          identifiantProjet: identifiantProjet.formatter(),
          identifiantGestionnaireReseau: identifiantGestionnaireReseau.formatter(),
          appelOffre,
          periode,
          referenceDossierRaccordement,
          dateDCR: dateDCR?.formatterDate(),
          codePostal,
          prix,
          coefficientKChoisi,
        }),
      ),
    };
  };
