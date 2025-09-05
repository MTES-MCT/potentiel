import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import { MotifDemandeMainlevéeGarantiesFinancières } from '../..';

export type DemanderMainlevéeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.DemanderMainlevée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
    demandéLe: DateTime.ValueType;
    demandéPar: Email.ValueType;
  }
>;

export const registerDemanderMainlevéeGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderMainlevéeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    demandéLe,
    demandéPar,
    motif,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.demanderMainlevée({
      motif,
      demandéLe,
      demandéPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.DemanderMainlevée', handler);
};
