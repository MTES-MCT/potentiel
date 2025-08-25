import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { InvalidOperationError } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { TâchePlanifiéeExecutéeEvent } from '../tâche-planifiée';
import { IdentifiantProjet } from '../..';

import { TypeTâchePlanifiéeGarantiesFinancières } from '.';

import { ÉchoirGarantiesFinancièresCommand } from './actuelles/échoir/échoirGarantiesFinancières.command';

type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent & Event;

export type Execute = Message<
  'System.Lauréat.GarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async ({
    type,
    payload: { typeTâchePlanifiée, identifiantProjet, exécutéeLe },
  }) => {
    if (
      type !== 'TâchePlanifiéeExecutée-V1' ||
      typeTâchePlanifiée !== TypeTâchePlanifiéeGarantiesFinancières.échoir.type
    ) {
      return;
    }

    await match(typeTâchePlanifiée)
      .with(TypeTâchePlanifiéeGarantiesFinancières.échoir.type, () =>
        mediator.send<ÉchoirGarantiesFinancièresCommand>({
          type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            échuLe: DateTime.convertirEnValueType(exécutéeLe),
          },
        }),
      )
      .otherwise((typeTâchePlanifiée) => {
        throw new InvalidOperationError("Le type de tâche planifiée n'existe pas", {
          typeTâchePlanifiée,
        });
      });
  };
  mediator.register('System.Lauréat.GarantiesFinancières.Saga.Execute', handler);
};
