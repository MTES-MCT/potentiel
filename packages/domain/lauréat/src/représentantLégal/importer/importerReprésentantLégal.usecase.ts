// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ImporterReprésentantLégalCommand } from './importerReprésentantLégal.command';

export type ImporterReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal',
  {
    identifiantProjetValue: string;
    nomReprésentantLégal: string;
    importéLe: string;
  }
>;

export const registerImporterReprésentantLégalUseCase = () => {
  const runner: MessageHandler<ImporterReprésentantLégalUseCase> = async ({
    identifiantProjetValue,
    nomReprésentantLégal,
    importéLe,
  }) =>
    mediator.send<ImporterReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        nomReprésentantLégal,
        importéLe: DateTime.convertirEnValueType(importéLe),
        importéPar: Email.system(),
      },
    });

  mediator.register('Lauréat.ReprésentantLégal.UseCase.ImporterReprésentantLégal', runner);
};
