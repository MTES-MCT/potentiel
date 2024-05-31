import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { MotifDemandeMainLevéeGarantiesFinancières } from '../..';
import { loadAbandonFactory } from '../../../abandon/abandon.aggregate';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';

export type DemanderMainLevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.MainLevée.Command.Demander',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    motif: MotifDemandeMainLevéeGarantiesFinancières.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
  }
>;

export const registerDemanderMainLevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const handler: MessageHandler<DemanderMainLevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    demandéLe,
    demandéPar,
    motif,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    const abandon = await loadAbandon(identifiantProjet, false);

    const achèvement = await loadAchèvement(identifiantProjet, false);

    await garantiesFinancières.demanderMainLevée({
      identifiantProjet,
      demandéLe,
      demandéPar,
      motif,
      statutAbandon: abandon.statut,
      achèvement,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.Command.Demander', handler);
};
