import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot } from '../../../..';
import { TypeGarantiesFinancières } from '../../../../candidature';

export type EnregistrerGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
  }
>;

export const registerEnregistrerGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    type,
    dateÉchéance,
    enregistréLe,
    enregistréPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.enregistrer({
      attestation,
      dateConstitution,
      type,
      dateÉchéance,
      enregistréLe,
      enregistréPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
    handler,
  );
};
