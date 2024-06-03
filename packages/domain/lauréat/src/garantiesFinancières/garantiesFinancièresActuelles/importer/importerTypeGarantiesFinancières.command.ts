import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { TypeGarantiesFinancières } from '../..';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ImporterTypeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    importéLe: DateTime.ValueType;
  }
>;

export const registerImporterTypeGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<ImporterTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    importéLe,
    type,
    dateÉchéance,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.importerType({
      identifiantProjet,
      importéLe,
      type,
      dateÉchéance,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
    handler,
  );
};
