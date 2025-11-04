import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { LauréatEntity } from '../../../lauréat.entity';
import { IdentifiantProjet } from '../../../..';
import { GarantiesFinancièresEnAttenteEntity, MotifDemandeGarantiesFinancières } from '../..';

export type ConsulterGarantiesFinancièresEnAttenteReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  régionProjet: string;
  appelOffre: string;
  période: string;
  famille?: string;
  motif: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
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

    const lauréat = await find<LauréatEntity>(`lauréat|${identifiantProjet.formatter()}`);

    const result = await find<GarantiesFinancièresEnAttenteEntity>(
      `projet-avec-garanties-financieres-en-attente|${identifiantProjet.formatter()}`,
    );

    return Option.isNone(result) ? Option.none : mapToReadModel(result, lauréat);
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancièresEnAttente',
    handler,
  );
};

const mapToReadModel = (
  {
    identifiantProjet,
    motif,
    dateLimiteSoumission,
    dernièreMiseÀJour,
  }: GarantiesFinancièresEnAttenteEntity,
  lauréat: Option.Type<LauréatEntity>,
): ConsulterGarantiesFinancièresEnAttenteReadModel => {
  const { appelOffre, période, famille } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet: Option.isSome(lauréat) ? lauréat.nomProjet.nom : 'N/A',
    régionProjet: Option.isSome(lauréat) ? lauréat.localité.région : 'N/A',
    appelOffre,
    période,
    famille,
    motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
    dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
    },
  };
};
