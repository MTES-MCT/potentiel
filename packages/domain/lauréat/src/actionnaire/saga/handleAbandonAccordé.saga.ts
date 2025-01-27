import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonAccordéEvent } from '../../abandon';
import { SupprimerChangementActionnaireCommand } from '..';

export const handleAbandonAccordé = async ({
  payload: { identifiantProjet },
}: AbandonAccordéEvent) => {
  await mediator.send<SupprimerChangementActionnaireCommand>({
    type: 'Lauréat.Actionnaire.Command.SupprimerChangementActionnaire',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      identifiantUtilisateur: Email.system(),
      dateSuppression: DateTime.now(),
    },
  });
};
