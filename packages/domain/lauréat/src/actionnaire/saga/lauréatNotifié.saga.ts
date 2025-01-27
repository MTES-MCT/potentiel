import { mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../../lauréat';
import { ImporterActionnaireCommand } from '..';

export const lauréatNotifiéSaga = async ({
  payload: { identifiantProjet, notifiéLe },
}: LauréatNotifiéEvent) => {
  await mediator.send<ImporterActionnaireCommand>({
    type: 'Lauréat.Actionnaire.Command.ImporterActionnaire',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(notifiéLe),
    },
  });
};
