import { mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../../lauréat';
import { ImporterReprésentantLégalCommand } from '../importer/importerReprésentantLégal.command';

export const buildLauréatNotifiéSaga = () => {
  const handler = async ({ payload: { identifiantProjet, notifiéLe } }: LauréatNotifiéEvent) =>
    mediator.send<ImporterReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        importéLe: DateTime.convertirEnValueType(notifiéLe),
        importéPar: Email.system(),
      },
    });

  return handler;
};
