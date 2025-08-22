import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import type { GarantiesFinancières } from '../..';

export type EnregistrerGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
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
    garantiesFinancières,
    enregistréLe,
    enregistréPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.enregistrer({
      attestation,
      dateConstitution,
      garantiesFinancières,
      enregistréLe,
      enregistréPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
    handler,
  );
};
