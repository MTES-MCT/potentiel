import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { ÉchoirGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.command';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent;

export type Execute = Message<'Lauréat.GarantiesFinancières.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet, typeTâchePlanifiée, exécutéeLe },
    } = event;
    switch (typeTâchePlanifiée) {
      case 'garanties-financières.échoir':
        await mediator.send<ÉchoirGarantiesFinancièresCommand>({
          type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            // TODO : Les params passés dans cette commande sont inutiles
            // L'aggégate porte déjà la date d'échéance et la date échuLe est en faite la même date ;)
            dateÉchéance: DateTime.now(),
            échuLe: DateTime.convertirEnValueType(exécutéeLe).ajouterNombreDeJours(-1),
          },
        });
        break;
    }
  };
  mediator.register('Lauréat.GarantiesFinancières.Saga.Execute', handler);
};
