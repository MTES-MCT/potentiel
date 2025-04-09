import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getAttestationDeConformité } from './getAttestationDeConformité';

type CheckAbandonAndAchèvement = {
  estAbandonné: boolean;
  aUnAbandonEnCours: boolean;
  estAchevé: boolean;
};

export const checkAbandonAndAchèvement = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: string,
): Promise<CheckAbandonAndAchèvement> => {
  const attestationConformitéExistante = await getAttestationDeConformité(identifiantProjet, rôle);

  if (attestationConformitéExistante) {
    return {
      estAbandonné: false,
      aUnAbandonEnCours: false,
      estAchevé: true,
    };
  }

  try {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    return {
      estAbandonné: Option.isSome(abandon) && abandon.statut.estAccordé(),
      aUnAbandonEnCours: Option.isSome(abandon) && abandon.statut.estEnCours(),
      estAchevé: false,
    };
  } catch (e) {
    getLogger('checkAbandonAndAchèvement').warn("Impossible de récupérer l'abandon", {
      error: (e as Error)?.message,
      identifiantProjet: identifiantProjet.formatter(),
    });

    return {
      estAbandonné: false,
      aUnAbandonEnCours: false,
      estAchevé: false,
    };
  }
};
