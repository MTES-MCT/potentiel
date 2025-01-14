import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { AbandonAccordéEvent } from '../../abandon';
import { ConsulterChangementActionnaireQuery, SupprimerChangementActionnaireCommand } from '..';

export const handleAbandonAccordé = async ({
  payload: { identifiantProjet },
}: AbandonAccordéEvent) => {
  const demande = await mediator.send<ConsulterChangementActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(demande)) {
    await mediator.send<SupprimerChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.SupprimerChangementActionnaire',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.system(),
        dateSuppression: DateTime.now(),
      },
    });
  }
};
