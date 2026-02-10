import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import { GarantiesFinancières } from '../../index.js';

export type ImporterGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.Importer',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    importéLe: DateTime.ValueType;
  }
>;

export const registerImporterGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ImporterGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    garantiesFinancières,
    importéLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.importer({
      garantiesFinancières,
      importéLe,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.Importer', handler);
};
