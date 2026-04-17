import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

export const changementProducteurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    enregistréLe,
    producteur,
    enregistréPar,
    raison,
    pièceJustificative,
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

  await updateOneProjection<Lauréat.Producteur.ProducteurEntity>(
    `producteur|${identifiantProjet}`,
    {
      nom: producteur,
      miseÀJourLe: enregistréLe,
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

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      enAttente: {
        motif: 'changement-producteur',
        dateLimiteSoumission: DateTime.convertirEnValueType(enregistréLe)
          .ajouterNombreDeMois(2)
          .formatter(),
      },
    },
  );
};
