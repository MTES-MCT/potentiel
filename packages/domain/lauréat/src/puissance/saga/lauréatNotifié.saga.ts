import { mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ImporterPuissanceCommand } from '..';

export const lauréatNotifiéSaga = async ({
  payload: { identifiantProjet, notifiéLe },
}: Lauréat.LauréatNotifiéEvent) => {
  await mediator.send<ImporterPuissanceCommand>({
    type: 'Lauréat.Puissance.Command.ImporterPuissance',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéeLe: DateTime.convertirEnValueType(notifiéLe),
    },
  });
};
