import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';

import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import * as TypeTâchePlanifiée from '../typeTâchePlanifiée.valueType';

import { ExécuterTâchePlanifiéeCommand } from './exécuterTâchePlanifiée.command';

export type ExécuterTâchePlanifiéeUseCase = Message<
  'System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée',
  {
    identifiantProjetValue: IdentifiantProjet.RawType;
    typeTâchePlanifiéeValue: TâchePlanifiée.RawType;
  }
>;

export const registerExécuterTâchePlanifiéeUseCase = () => {
  const handler: MessageHandler<ExécuterTâchePlanifiéeUseCase> = async ({
    identifiantProjetValue,
    typeTâchePlanifiéeValue,
  }) => {
    await mediator.send<ExécuterTâchePlanifiéeCommand>({
      type: 'System.TâchePlanifiée.Command.ExécuterTâchePlanifiée',
      data: {
        typeTâchePlanifiée: TypeTâchePlanifiée.convertirEnValueType(typeTâchePlanifiéeValue),
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
      },
    });
  };
  mediator.register('System.TâchePlanifiée.UseCase.ExécuterTâchePlanifiée', handler);
};
