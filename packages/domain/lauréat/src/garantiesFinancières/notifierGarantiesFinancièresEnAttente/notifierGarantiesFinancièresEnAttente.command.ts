import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';

export type NotifierGarantiesFinancièresEnAttenteCommand = Message<
  'NOTIFIER_GARANTIES_FINANCIÈRES_EN_ATTENTE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateLimiteSoumission: DateTime.ValueType;
    notifiéLe: DateTime.ValueType;
  }
>;

export const registerNotifierGarantiesFinancièresEnAttenteCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<NotifierGarantiesFinancièresEnAttenteCommand> = async ({
    identifiantProjet,
    dateLimiteSoumission,
    notifiéLe,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.notifierGarantiesFinancièresEnAttente({
      identifiantProjet,
      dateLimiteSoumission,
      notifiéLe,
    });
  };
  mediator.register('NOTIFIER_GARANTIES_FINANCIÈRES_EN_ATTENTE_COMMAND', handler);
};
