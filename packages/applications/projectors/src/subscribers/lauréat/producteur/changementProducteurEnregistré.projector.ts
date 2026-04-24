import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Lauréat } from '@potentiel-domain/projet';

export const changementProducteurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    producteur,
    enregistréPar,
    raison,
    pièceJustificative,
    numéroImmatriculation,
  },
}: Lauréat.Producteur.ChangementProducteurEnregistréEvent) => {
  const producteurActuel = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
    type: 'Lauréat.Producteur.Query.ConsulterProducteur',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(producteurActuel)) {
    getLogger('changementProducteurEnregistréProjector').error(`Producteur non trouvé !`, {
      identifiantProjet,
    });
  }

  const ancienProducteur = Option.match(producteurActuel)
    .some((producteur) => producteur.producteur)
    .none(() => 'Aucun');

  // viovio : à voir si pas de valeur, est ce qu'on écrase ?
  await updateOneProjection<Lauréat.Producteur.ProducteurEntity>(
    `producteur|${identifiantProjet}`,
    {
      nom: producteur,
      miseÀJourLe: enregistréLe,
      numéroImmatriculation,
    },
  );

  await upsertProjection<Lauréat.Producteur.ChangementProducteurEntity>(
    `changement-producteur|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        ancienProducteur,
        nouveauProducteur: producteur,
        enregistréPar,
        enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
