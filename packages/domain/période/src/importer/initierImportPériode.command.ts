import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';
import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import type * as IdentifiantPériode from '../identifiantPériode.valueType.js';
import { PériodeAggregate } from '../période.aggregate.js';

export type InitierImportPériodeCommand = Message<
  'Période.Command.InitierImportPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    initiéLe: DateTime.ValueType;
    initiéPar: Email.ValueType;
    instruction: Array<
      { identifiantProjet: IdentifiantProjet.ValueType } & Candidature.Instruction.ValueType
    >;
  }
>;

export const registerInitierImportPériodeCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<InitierImportPériodeCommand> = async ({
    identifiantPériode,
    initiéLe,
    initiéPar,
    instruction,
  }) => {
    const période = await loadAggregate(
      PériodeAggregate,
      `période|${identifiantPériode.formatter()}`,
      undefined,
    );

    await période.initierImport({
      initiéLe,
      initiéPar,
      instruction,
      identifiantPériode,
    });
  };

  mediator.register('Période.Command.InitierImportPériode', handler);
};
