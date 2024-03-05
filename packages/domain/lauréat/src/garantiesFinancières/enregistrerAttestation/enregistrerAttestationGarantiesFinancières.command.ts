import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';
import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

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
  loadAggregate: LoadAggregate,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<EnregistrerAttestationGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    enregistréLe,
    enregistréPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.enregistrerAttestation({
      identifiantProjet,
      attestation,
      dateConstitution,
      enregistréLe,
      enregistréPar,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.EnregistrerAttestation', handler);
};
