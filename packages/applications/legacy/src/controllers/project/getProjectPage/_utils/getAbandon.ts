import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Lauréat } from '@potentiel-domain/projet';

export type GetAbandon = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Lauréat.Abandon.ConsulterAbandonReadModel | undefined>;

export const getAbandon: GetAbandon = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  try {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    return Option.isSome(abandon) ? abandon : undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getAbandonStatut').error(`Impossible de consulter l'abandon`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
