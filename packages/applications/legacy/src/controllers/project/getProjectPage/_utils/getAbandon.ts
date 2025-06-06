import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Lauréat } from '@potentiel-domain/projet';
import { ConsulterAbandonReadModel } from '@potentiel-domain/projet/dist/lauréat/abandon';

export type GetAbandon = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<ConsulterAbandonReadModel | undefined>;

export const getAbandon: GetAbandon = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  try {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (Option.isNone(abandon)) {
      return undefined;
    }

    const { statut } = abandon;

    if (statut.estEnCours() || statut.estRejeté() || statut.estAccordé()) {
      return abandon;
    }

    return undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getAbandonStatut').error(`Impossible de consulter l'abandon`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
