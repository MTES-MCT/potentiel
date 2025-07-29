import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type EnregistrerAttestationGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EnregistrerAttestation',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    enregistréPar: IdentifiantUtilisateur.ValueType;
    enregistréLe: DateTime.ValueType;
  }
>;

export const registerEnregistrerAttestationGarantiesFinancièresCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerAttestationGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    enregistréLe,
    enregistréPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.garantiesFinancières.enregistrerAttestation({
      attestation,
      dateConstitution,
      enregistréLe,
      enregistréPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.EnregistrerAttestation', handler);
};
