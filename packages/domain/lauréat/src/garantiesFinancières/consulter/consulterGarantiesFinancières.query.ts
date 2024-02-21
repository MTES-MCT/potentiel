import { Message, MessageHandler, mediator } from 'mediateur';

import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import { Find } from '@potentiel-libraries/projection';
import { TypeGarantiesFinancières } from '..';
import { AucunesGarantiesFinancières } from '../aucunesGarantiesFinancières.error';
import { GarantiesFinancièresEntity } from '../garantiesFinancières.projection';

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  //TODO : valueType pour le statut de GF
  statut: string;
  dernièreMiseÀJour: DateTime.ValueType;

  validées?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    validéLe: DateTime.ValueType;
  };
  àTraiter?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
  };
  enAttente?: { dateLimiteSoumission: DateTime.ValueType; notifiéLe: DateTime.ValueType };
};

export type ConsulterGarantiesFinancièresQuery = Message<
  'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
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

    const validées: ConsulterGarantiesFinancièresReadModel['validées'] = result.validées
      ? {
          type: TypeGarantiesFinancières.convertirEnValueType(result.type),
          dateÉchéance: result.validées.dateÉchéance
            ? DateTime.convertirEnValueType(result.validées.dateÉchéance)
            : undefined,
          dateConstitution: DateTime.convertirEnValueType(result.validées.dateConstitution),
          validéLe: DateTime.convertirEnValueType(result.validées.validéLe),
        }
      : undefined;
    const àTraiter: ConsulterGarantiesFinancièresReadModel['àTraiter'] = result.àTraiter
      ? {
          type: TypeGarantiesFinancières.convertirEnValueType(result.type),
          dateÉchéance: result.àTraiter.dateÉchéance
            ? DateTime.convertirEnValueType(result.àTraiter.dateÉchéance)
            : undefined,
          dateConstitution: DateTime.convertirEnValueType(result.àTraiter.dateConstitution),
          soumisLe: DateTime.convertirEnValueType(result.àTraiter.soumisLe),
        }
      : undefined;
    const enAttente: ConsulterGarantiesFinancièresReadModel['enAttente'] = result.enAttente
      ? {
          dateLimiteSoumission: DateTime.convertirEnValueType(
            result.enAttente.dateLimiteSoumission,
          ),
          notifiéLe: DateTime.convertirEnValueType(result.enAttente.notifiéLe),
        }
      : undefined;

    return {
      identifiantProjet,
      statut: result.statut,
      dernièreMiseÀJour: DateTime.convertirEnValueType(result.misÀJourLe),
      validées,
      àTraiter,
      enAttente,
    };
  };
  mediator.register('CONSULTER_GARANTIES_FINANCIÈRES_QUERY', handler);
};
