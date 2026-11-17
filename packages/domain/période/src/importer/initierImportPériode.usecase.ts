import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import * as IdentifiantPériode from '../identifiantPériode.valueType.js';
import type { InitierImportPériodeCommand } from './initierImportPériode.command.js';

export type InitierImportPériodeUseCase = Message<
  'Période.UseCase.ImporterPériode',
  {
    identifiantPériodeValue: IdentifiantPériode.RawType;
    initiéLeValue: DateTime.RawType;
    initiéParValue: Email.RawType;
    instructionValue: Array<
      { identifiantProjet: IdentifiantProjet.RawType } & Candidature.Instruction.RawType
    >;
    vérifierLesDonnéesSansImportRéel?: true;
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

    await mediator.send<InitierImportPériodeCommand>({
      type: 'Période.Command.InitierImportPériode',
      data: {
        identifiantPériode,
        initiéLe: DateTime.convertirEnValueType(initiéLeValue),
        initiéPar: Email.convertirEnValueType(initiéParValue),
        instruction: instructionValue.map((projet) => ({
          identifiantProjet: IdentifiantProjet.convertirEnValueType(projet.identifiantProjet),
          ...Candidature.Instruction.convertirEnValueType(projet),
        })),
      },
    });
  };

  mediator.register('Période.UseCase.ImporterPériode', handler);
};
