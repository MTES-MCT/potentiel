import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ImporterReprésentantLégalCommand } from '../importer/importerReprésentantLégal.command';

export const lauréatNotifiéSaga = async ({
  payload: { identifiantProjet, notifiéLe },
}: Lauréat.LauréatNotifiéEvent) =>
  mediator.send<ImporterReprésentantLégalCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(notifiéLe),
      importéPar: Email.system(),
    },
  });
