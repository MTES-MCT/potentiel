import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../../../index.js';
import type { GarantiesFinancièresEntity } from '../../garantiesFinancières.entity.js';
import { MotifDemandeGarantiesFinancières } from '../../index.js';

export type ConsulterGarantiesFinancièresEnAttenteReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  motifEnAttente: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par?: Email.ValueType;
  };
};

export type ConsulterGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterGarantiesFinancièresEnAttenteReadModel>
>;

export type ConsulterGarantiesFinancièresEnAttenteDependencies = {
  find: Find;
};

export const registerConsulterGarantiesFinancièresEnAttenteQuery = ({
  find,
}: ConsulterGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ConsulterGarantiesFinancièresEnAttenteQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result) || !result.enAttente) {
      return Option.none;
    }

    return mapToReadModel({ ...result, enAttente: result.enAttente });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
    handler,
  );
};

type MapToReadModelProps = GarantiesFinancièresEntity & {
  enAttente: Exclude<GarantiesFinancièresEntity['enAttente'], undefined>;
};
export const mapToReadModel = ({
  identifiantProjet,
  dernièreMiseÀJour,
  enAttente,
}: MapToReadModelProps): ConsulterGarantiesFinancièresEnAttenteReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    motifEnAttente: MotifDemandeGarantiesFinancières.convertirEnValueType(enAttente.motif),
    dateLimiteSoumission: DateTime.convertirEnValueType(enAttente.dateLimiteSoumission),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
      par: dernièreMiseÀJour.par ? Email.convertirEnValueType(dernièreMiseÀJour.par) : undefined,
    },
  };
};
