import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export type GetAbandonStatut = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<{ statut: string } | undefined>;

export const getAbandonStatut: GetAbandonStatut = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  try {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (Option.isNone(abandon)) {
      return;
    }

    const { statut } = abandon;

    switch (statut.statut) {
      case 'demandé':
      case 'confirmé':
      case 'accordé':
      case 'rejeté':
        return { statut: statut.statut };
      case 'confirmation-demandée':
        return { statut: 'à confirmer' };
      default:
        return undefined;
    }
  } catch (error) {
    getLogger('Legacy|getProjectPage|getAbandonStatut').error(`Impossible de consulter l'abandon`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
