import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';

import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { TypeGarantiesFinancières } from '../..';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type EnregistrerGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    enregistréPar: IdentifiantUtilisateur.ValueType;
    enregistréLe: DateTime.ValueType;
  }
>;

export const registerEnregistrerGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<EnregistrerGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    type,
    dateÉchéance,
    enregistréLe,
    enregistréPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.enregistrer({
      identifiantProjet,
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
