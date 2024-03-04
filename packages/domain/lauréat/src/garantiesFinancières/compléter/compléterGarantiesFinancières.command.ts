import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LoadAggregate } from '@potentiel-domain/core';
import { TypeGarantiesFinancières } from '..';
import { loadGarantiesFinancièresFactory } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';

export type CompléterGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.CompléterGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
    dateConstitution: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    rôleUtilisateur: Role.ValueType;
    complétéLe: DateTime.ValueType;
  }
>;

export const registerCompléterGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<CompléterGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    attestation,
    dateConstitution,
    type,
    dateÉchéance,
    complétéLe,
    identifiantUtilisateur,
    rôleUtilisateur,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    await garantiesFinancières.compléter({
      identifiantProjet,
      attestation,
      dateConstitution,
      type,
      dateÉchéance,
      complétéLe,
      identifiantUtilisateur,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Command.CompléterGarantiesFinancières', handler);
};
