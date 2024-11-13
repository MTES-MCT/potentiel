import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';

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
        return;
    }
  } catch (error) {
    return;
  }
};
