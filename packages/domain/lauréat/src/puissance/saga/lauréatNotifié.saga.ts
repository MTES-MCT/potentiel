import { mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../../lauréat';
import { ImporterPuissanceCommand } from '..';

export const lauréatNotifiéSaga = async ({
  payload: { identifiantProjet, notifiéLe },
}: LauréatNotifiéEvent) => {
  await mediator.send<ImporterPuissanceCommand>({
    type: 'Lauréat.Puissance.Command.ImporterPuissance',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéeLe: DateTime.convertirEnValueType(notifiéLe),
    },
  });
};
