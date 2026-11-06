import { mediator } from 'mediateur';

import type { AchevementV2 } from '@potentiel-applications/api-documentation';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { getUtilisateur, mapToRangeOptions } from '#helpers';
import { mapToDonneesProjetPourAchevement } from './mapToDonneesProjetPourAchevement.js';

export const listerProjetsEnAttenteDAchevementHandler: AchevementV2['listerProjetsEnAttenteDAchevement'] =
  async (_, options) => {
    const { after, appelOffre, periode, depuis } = options ?? {};
    const utilisateur = getUtilisateur();

    const result = await mediator.send<Lauréat.Achèvement.ListerProjetsEnAttenteDAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ListerProjetsEnAttenteDAchèvement',
      data: {
        appelOffre: appelOffre ? [appelOffre] : undefined,
        periode,
        depuis: depuis ? DateTime.convertirEnValueType(depuis).formatter() : undefined,
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
        range: mapToRangeOptions(after),
      },
    });

    return {
      range: result.range,
      total: result.total,
      items: result.items.map(mapToDonneesProjetPourAchevement),
    };
  };
