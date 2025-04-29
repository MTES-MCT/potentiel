import { mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ImporterProducteurCommand } from '..';

export const lauréatNotifiéSaga = async ({
  payload: { identifiantProjet, notifiéLe },
}: Lauréat.LauréatNotifiéEvent) => {
  await mediator.send<ImporterProducteurCommand>({
    type: 'Lauréat.Producteur.Command.ImporterProducteur',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(notifiéLe),
    },
  });
};
