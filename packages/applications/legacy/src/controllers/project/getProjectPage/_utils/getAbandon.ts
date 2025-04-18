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
      return undefined;
    }

    const { statut } = abandon;

    if (statut.estEnCours() || statut.estRejeté() || statut.estAccordé()) {
      return { statut: statut.statut };
    }

    return undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getAbandonStatut').error(`Impossible de consulter l'abandon`, {
      identifiantProjet: identifiantProjet.formatter(),
    });
    return undefined;
  }
};
