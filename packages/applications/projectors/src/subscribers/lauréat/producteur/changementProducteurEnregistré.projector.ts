import { mediator } from 'mediateur';

import { Producteur } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementProducteurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    producteur,
    enregistréPar,
    raison,
    pièceJustificative,
  },
}: Producteur.ChangementProducteurEnregistréEvent) => {
  const producteurActuel = await mediator.send<Producteur.ConsulterProducteurQuery>({
    type: 'Lauréat.Producteur.Query.ConsulterProducteur',
    data: {
      identifiantProjet,
    },
  });

  const ancienProducteur = Option.match(producteurActuel)
    .some((producteur) => producteur.producteur)
    .none(() => 'Aucun');

  await updateOneProjection<Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    nom: producteur,
    misÀJourLe: enregistréLe,
  });

  await upsertProjection<Producteur.ChangementProducteurEntity>(
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
