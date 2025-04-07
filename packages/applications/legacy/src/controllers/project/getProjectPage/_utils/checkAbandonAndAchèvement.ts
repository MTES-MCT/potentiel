import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getAttestationDeConformité } from './getAttestationDeConformité';

export const checkAbandonAndAchèvement = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: string,
) => {
  const attestationConformitéExistante = await getAttestationDeConformité(identifiantProjet, rôle);

  if (attestationConformitéExistante) {
    return true;
  }

  try {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });
    if (Option.isNone(abandon)) return false;
    return abandon.statut.estAccordé() || abandon.statut.estEnCours();
  } catch (e) {
    getLogger('getActionnaire.checkActionnaire').warn("Impossible de récupérer l'abandon", {
      error: (e as Error)?.message,
      identifiantProjet: identifiantProjet.formatter(),
    });
    return false;
  }
};
