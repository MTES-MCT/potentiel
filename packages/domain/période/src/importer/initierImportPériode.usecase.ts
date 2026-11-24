import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import * as IdentifiantPériode from '../identifiantPériode.valueType.js';
import type { InitierImportPériodeCommand } from './initierImportPériode.command.js';

export type InitierImportPériodeUseCase = Message<
  'Période.UseCase.InitierImportPériode',
  {
    identifiantPériodeValue: IdentifiantPériode.RawType;
    initiéLeValue: DateTime.RawType;
    initiéParValue: Email.RawType;
    instructionValue: Array<
      { identifiantProjet: IdentifiantProjet.RawType } & Candidature.Instruction.RawType
    >;
  }
>;

export const registerInitierImportPériodeUseCase = () => {
  const handler: MessageHandler<InitierImportPériodeUseCase> = async ({
    identifiantPériodeValue,
    initiéLeValue,
    initiéParValue,
    instructionValue,
  }) => {
    const identifiantPériode = IdentifiantPériode.convertirEnValueType(identifiantPériodeValue);

    const instruction = instructionValue.map((projet) => ({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(projet.identifiantProjet),
      ...Candidature.Instruction.convertirEnValueType(projet),
    }));

    await mediator.send<InitierImportPériodeCommand>({
      type: 'Période.Command.InitierImportPériode',
      data: {
        identifiantPériode,
        initiéLe: DateTime.convertirEnValueType(initiéLeValue),
        initiéPar: Email.convertirEnValueType(initiéParValue),
        instruction,
      },
    });
  };

  mediator.register('Période.UseCase.InitierImportPériode', handler);
};
