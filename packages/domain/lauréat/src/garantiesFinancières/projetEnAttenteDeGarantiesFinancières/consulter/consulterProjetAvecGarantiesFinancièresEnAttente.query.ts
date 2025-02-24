import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import {
  MotifDemandeGarantiesFinancières,
  ProjetAvecGarantiesFinancièresEnAttenteEntity,
} from '../..';

export type ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel = {
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

export type ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel>
>;

export type ConsulterProjetAvecGarantiesFinancièresEnAttenteDependencies = {
  find: Find;
};

export const registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery = ({
  find,
}: ConsulterProjetAvecGarantiesFinancièresEnAttenteDependencies) => {
  const handler: MessageHandler<ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<ProjetAvecGarantiesFinancièresEnAttenteEntity>(
      `projet-avec-garanties-financieres-en-attente|${identifiantProjet.formatter()}`,
    );

    return Option.isNone(result) ? Option.none : mapToReadModel(result);
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
    handler,
  );
};

const mapToReadModel = ({
  identifiantProjet,
  projet: { nom, appelOffre, période, famille, région },
  motif,
  dateLimiteSoumission,
  dernièreMiseÀJour,
}: ProjetAvecGarantiesFinancièresEnAttenteEntity): ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet: nom,
  régionProjet: région,
  appelOffre,
  période,
  famille,
  motif: MotifDemandeGarantiesFinancières.convertirEnValueType(motif),
  dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
  },
});
