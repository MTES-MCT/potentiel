import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { MotifDemandeMainlevéeGarantiesFinancières } from '../..';

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
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<DemanderMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    demandéLe,
    demandéPar,
    motif,
  }) => {
    const {
      statut,
      lauréat: {
        achèvement: { preuveTransmissionAuCocontractant },
      },
    } = await getProjetAggregateRoot(identifiantProjet);
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    await garantiesFinancières.demanderMainlevée({
      identifiantProjet,
      demandéLe,
      demandéPar,
      motif,
      estAbandonné: statut.estAbandonné(),
      aUnePreuveTransmissionAuCocontractant: Option.isSome(preuveTransmissionAuCocontractant),
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.Command.Demander', handler);
};
