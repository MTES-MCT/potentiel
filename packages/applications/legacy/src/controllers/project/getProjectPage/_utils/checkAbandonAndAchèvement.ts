import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getAttestationDeConformité } from './getAttestationDeConformité';

type CheckAbandonAndAchèvement = {
  estAbandonné: boolean;
  estAchevéOuAbandonné: boolean;
};

export const checkAbandonAndAchèvement = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: string,
): Promise<CheckAbandonAndAchèvement> => {
  const attestationConformitéExistante = await getAttestationDeConformité(identifiantProjet, rôle);

  if (attestationConformitéExistante) {
    return {
      estAbandonné: false,
      estAchevéOuAbandonné: true,
    };
  }

  try {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    const aAbandonEnCours = Option.isSome(abandon) && abandon.statut.estEnCours();
    const estAbandonné = Option.isSome(abandon) && abandon.statut.estAccordé();

    return {
      estAbandonné,
      estAchevéOuAbandonné: aAbandonEnCours || estAbandonné,
    };
  } catch (e) {
    getLogger('checkAbandonAndAchèvement').warn("Impossible de récupérer l'abandon", {
      error: (e as Error)?.message,
      identifiantProjet: identifiantProjet.formatter(),
    });

    return {
      estAbandonné: false,
      estAchevéOuAbandonné: false,
    };
  }
};
