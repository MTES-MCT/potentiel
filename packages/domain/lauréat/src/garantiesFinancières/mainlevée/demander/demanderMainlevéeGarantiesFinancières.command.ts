import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { MotifDemandeMainlevéeGarantiesFinancières } from '../..';
import { loadAbandonFactory } from '../../../abandon/abandon.aggregate';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';

export type DemanderMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.Command.Demander',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
  }
>;

export const registerDemanderMainlevéeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const handler: MessageHandler<DemanderMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    demandéLe,
    demandéPar,
    motif,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    const abandon = await loadAbandon(identifiantProjet, false);

    const achèvement = await loadAchèvement(identifiantProjet, false);

    await garantiesFinancières.demanderMainlevée({
      identifiantProjet,
      demandéLe,
      demandéPar,
      motif,
      statutAbandon: abandon.statut,
      achèvement,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Command.Demander', handler);
};
