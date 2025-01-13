import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { AbandonAccordéEvent } from '../../abandon';
import {
  ConsulterDemandeChangementActionnaireQuery,
  SupprimerDemandeChangementActionnaireCommand,
} from '..';

export const handleAbandonAccordé = async ({
  payload: { identifiantProjet },
}: AbandonAccordéEvent) => {
  const demande = await mediator.send<ConsulterDemandeChangementActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterDemandeChangementActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(demande)) {
    await mediator.send<SupprimerDemandeChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.SupprimerDemandeChangementActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.system(),
        dateSuppression: DateTime.now(),
      },
    });
  }
};
