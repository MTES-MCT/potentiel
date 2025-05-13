import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { SupprimerChangementActionnaireCommand } from '..';

export const abandonAccordéSaga = async ({
  payload: { identifiantProjet },
}: Lauréat.Abandon.AbandonAccordéEvent) => {
  await mediator.send<SupprimerChangementActionnaireCommand>({
    type: 'Lauréat.Actionnaire.Command.SupprimerChangementActionnaire',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      identifiantUtilisateur: Email.system(),
      dateSuppression: DateTime.now(),
    },
  });
};
