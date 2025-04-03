import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const getPériodeAppelOffres = cache(
  async (identifiantProjet: IdentifiantProjet.ValueType) => {
    const logger = getLogger('getPériodeAppelOffres');

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });
    if (Option.isNone(appelOffres)) {
      logger.warn(`Appel d'offres non trouvé`, { identifiantProjet });

      return notFound();
    }
    const période = appelOffres.periodes.find((p) => p.id === identifiantProjet.période);
    if (!période) {
      logger.warn(`Période non trouvée`, { identifiantProjet });
      return notFound();
    }
    const famille = période.familles?.find((f) => f.id === identifiantProjet.famille);
    return { appelOffres, période, famille };
  },
);
