import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import {
  StatutGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
  TypeGarantiesFinancières,
} from '..';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';
import { GarantiesFinancièresEntity } from '../garantiesFinancières.entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutGarantiesFinancières.ValueType;
  dernièreMiseÀJour: DateTime.ValueType;

  validées?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    validéLe: DateTime.ValueType;
    //attestation: DocumentProjet.ValueType;
  };
  àTraiter?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
    attestation: DocumentProjet.ValueType;
  };
  enAttente?: { dateLimiteSoumission: DateTime.ValueType; demandéLe: DateTime.ValueType };
};

export type ConsulterGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancière.Query.ConsulterGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  ConsulterGarantiesFinancièresReadModel
>;

export type ConsulterGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterGarantiesFinancièresQuery = ({
  find,
}: ConsulterGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (isNone(result)) {
      throw new AucunesGarantiesFinancières();
    }

    const validées: ConsulterGarantiesFinancièresReadModel['validées'] = result.validées && {
      type: TypeGarantiesFinancières.convertirEnValueType(result.validées.type),
      ...(result.validées.dateÉchéance && {
        dateÉchéance: DateTime.convertirEnValueType(result.validées.dateÉchéance),
      }),
      dateConstitution: DateTime.convertirEnValueType(result.validées.dateConstitution),
      validéLe: DateTime.convertirEnValueType(result.validées.validéLe),
    };
    const àTraiter: ConsulterGarantiesFinancièresReadModel['àTraiter'] = result.àTraiter && {
      type: TypeGarantiesFinancières.convertirEnValueType(result.àTraiter.type),
      ...(result.àTraiter.dateÉchéance && {
        dateÉchéance: DateTime.convertirEnValueType(result.àTraiter.dateÉchéance),
      }),
      dateConstitution: DateTime.convertirEnValueType(result.àTraiter.dateConstitution),
      soumisLe: DateTime.convertirEnValueType(result.àTraiter.soumisLe),
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        TypeDocumentGarantiesFinancières.garantiesFinancièresÀTraiter.formatter(),
        DateTime.convertirEnValueType(result.àTraiter.soumisLe).formatter(),
        result.àTraiter.attestation.format,
      ),
    };
    const enAttente: ConsulterGarantiesFinancièresReadModel['enAttente'] = result.enAttente && {
      dateLimiteSoumission: DateTime.convertirEnValueType(result.enAttente.dateLimiteSoumission),
      demandéLe: DateTime.convertirEnValueType(result.enAttente.demandéLe),
    };
    return {
      identifiantProjet,
      statut: StatutGarantiesFinancières.convertirEnValueType(result.statut),
      dernièreMiseÀJour: DateTime.convertirEnValueType(result.misÀJourLe),
      validées,
      àTraiter,
      enAttente,
    };
  };
  mediator.register('Lauréat.GarantiesFinancière.Query.ConsulterGarantiesFinancières', handler);
};
