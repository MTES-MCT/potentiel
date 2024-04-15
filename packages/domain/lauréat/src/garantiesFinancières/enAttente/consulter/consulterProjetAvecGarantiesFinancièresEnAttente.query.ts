import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import { Find } from '@potentiel-domain/core';
import {
  MotifDemandeGarantiesFinancières,
  ProjetAvecGarantiesFinancièresEnAttenteEntity,
} from '../..';
import { AucuneGarantiesFinancieresEnAttentePourLeProjetError } from '../../aucuneGarantiesFinancieresEnAttentePourLeProjet.error';

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
  ConsulterProjetAvecGarantiesFinancièresEnAttenteReadModel
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

    if (Option.isNone(result)) {
      throw new AucuneGarantiesFinancieresEnAttentePourLeProjetError();
    }

    return {
      identifiantProjet,
      nomProjet: result.nomProjet,
      régionProjet: result.régionProjet,
      appelOffre: result.appelOffre,
      période: result.période,
      famille: result.famille,
      motif: MotifDemandeGarantiesFinancières.convertirEnValueType(result.motif),
      dateLimiteSoumission: DateTime.convertirEnValueType(result.dateLimiteSoumission),
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(result.dernièreMiseÀJour.date),
      },
    };
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
    handler,
  );
};
