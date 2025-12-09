import { mediator } from 'mediateur';
import { cache } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

export const checkLauréatSansAbandonOuAchèvement = cache(
  async (identifiantProjet: IdentifiantProjet.ValueType) => {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    const estAbandonOuAUneDemandeEnCours =
      Option.isSome(abandon) && (abandon.demandeEnCours || abandon.estAbandonné);

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    const estAchevé = Option.isSome(achèvement) && achèvement.estAchevé;

    return !estAbandonOuAUneDemandeEnCours && !estAchevé;
  },
);
