import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { Dépôt, DétailCandidature, Instruction } from '..';
import { IdentifiantProjet } from '../..';

import { CorrigerCandidatureCommand } from './corrigerCandidature.command';

export type CorrigerCandidatureUseCase = Message<
  'Candidature.UseCase.CorrigerCandidature',
  {
    identifiantProjetValue: string;

    dépôtValue: Dépôt.RawType;
    instructionValue: Instruction.RawType;

    corrigéLe: string;
    corrigéPar: string;
    doitRégénérerAttestation?: true;
    détailsValue?: DétailCandidature.RawType;
  }
>;

export const registerCorrigerCandidatureUseCase = () => {
  const handler: MessageHandler<CorrigerCandidatureUseCase> = async (payload) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      payload.identifiantProjetValue,
    );

    await mediator.send<CorrigerCandidatureCommand>({
      type: 'Candidature.Command.CorrigerCandidature',
      data: {
        identifiantProjet,
        dépôt: Dépôt.convertirEnValueType(payload.dépôtValue),
        instruction: Instruction.convertirEnValueType(payload.instructionValue),
        corrigéLe: DateTime.convertirEnValueType(payload.corrigéLe),
        corrigéPar: Email.convertirEnValueType(payload.corrigéPar),
        doitRégénérerAttestation: payload.doitRégénérerAttestation,
        détail:
          payload.détailsValue && Object.keys(payload.détailsValue).length > 0
            ? payload.détailsValue
            : undefined,
      },
    });
  };

  mediator.register('Candidature.UseCase.CorrigerCandidature', handler);
};
