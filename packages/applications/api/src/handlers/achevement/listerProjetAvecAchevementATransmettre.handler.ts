import { mediator } from 'mediateur';

import { AchevementV1 } from '@potentiel-applications/api-documentation';
import { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, mapToRangeOptions } from '#helpers';

export const listerProjetAvecAchevementATransmettreHandler: AchevementV1['listerProjetAvecAchevementATransmettre'] =
  async (_, options) => {
    const { after, appelOffre, periode } = options ?? {};
    const utilisateur = getUtilisateur();

    const result =
      await mediator.send<Lauréat.Achèvement.ListerProjetAvecAchevementATransmettreQuery>({
        type: 'Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre',
        data: {
          appelOffre,
          periode,
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
          range: mapToRangeOptions(after),
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
