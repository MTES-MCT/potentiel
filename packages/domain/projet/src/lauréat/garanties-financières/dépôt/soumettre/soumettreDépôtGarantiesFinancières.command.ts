import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot } from '../../../../getProjetAggregateRoot.port';
import { GarantiesFinancières } from '../..';

export type SoumettreDépôtGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    garantiesFinancières: GarantiesFinancières.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    soumisPar: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerSoumettreDépôtGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SoumettreDépôtGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    soumisLe,
    garantiesFinancières,
    soumisPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.soumettreDépôt({
      garantiesFinancières,
      attestation,
      dateConstitution,
      soumisLe,
      soumisPar,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.SoumettreDépôtGarantiesFinancières',
    handler,
  );
};
