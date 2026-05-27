import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const changementProducteurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    producteur,
    enregistréPar,
    raison,
    pièceJustificative,
    numéroIdentification,
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

  const ancienNuméroIdentification = Option.match(producteurActuel)
    .some((producteur) => producteur.numéroIdentification)
    .none(() => undefined);

  await upsertProjection<Lauréat.Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: producteur,
    miseÀJourLe: enregistréLe,
    numéroIdentification,
  });

  await upsertProjection<Lauréat.Producteur.ChangementProducteurEntity>(
    `changement-producteur|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        ancien: {
          producteur: ancienProducteur,
          numéroIdentification: ancienNuméroIdentification,
        },
        nouveau: {
          producteur,
          numéroIdentification: numéroIdentification?.siret
            ? Lauréat.Producteur.NuméroIdentification.bind({
              siret: numéroIdentification.siret,
            })
            : undefined,
        },
        enregistréPar,
        enregistréLe,
        raison,
        pièceJustificative,
      },
    },
  );
};
