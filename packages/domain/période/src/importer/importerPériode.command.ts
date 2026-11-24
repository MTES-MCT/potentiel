import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type * as IdentifiantPériode from '../identifiantPériode.valueType.js';
import { PériodeAggregate } from '../période.aggregate.js';

export type ImporterPériodeCommand = Message<
  'Période.Command.ImporterPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
    projetsEnErreur: Array<{ identifiantProjet: IdentifiantProjet.ValueType; motif: string }>;
  }
>;

export const registerImporterPériodeCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<ImporterPériodeCommand> = async ({
    identifiantPériode,
    importéLe,
    importéPar,
    projetsEnErreur,
  }) => {
    const période = await loadAggregate(
      PériodeAggregate,
      `période|${identifiantPériode.formatter()}`,
      undefined,
    );

    await période.importer({
      identifiantPériode,
      importéLe,
      importéPar,
      projetsEnErreur,
    });
  };

  mediator.register('Période.Command.ImporterPériode', handler);
};
