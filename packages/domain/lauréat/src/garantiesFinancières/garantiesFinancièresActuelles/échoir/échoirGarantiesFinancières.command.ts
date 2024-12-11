import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';

export type ÉchoirGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerÉchoirGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);

  const handler: MessageHandler<ÉchoirGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);

    await garantiesFinancières.échoir({
      identifiantProjet,
      aUneAttestationDeConformité: !!achèvement.attestationConformité?.format,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières', handler);
};
