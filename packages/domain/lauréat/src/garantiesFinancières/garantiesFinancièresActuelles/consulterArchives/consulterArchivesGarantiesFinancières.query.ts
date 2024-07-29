import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';

import { GarantiesFinancièresEntity } from '../garantiesFinancièresActuelles.entity';
import { GarantiesFinancièresDetailsEntity } from '../..';
import {
  GarantiesFinancièresReadModel,
  mapGarantiesFinancièresToReadModel,
} from '../consulter/consulterGarantiesFinancières.query';

export type ConsulterArchivesGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  archives: Array<GarantiesFinancièresReadModel>;
};

export type ConsulterArchivesGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterArchivesGarantiesFinancièresReadModel>
>;

export type ConsulterArchivesGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterArchivesGarantiesFinancièresQuery = ({
  find,
}: ConsulterArchivesGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterArchivesGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    if (result.archives.length === 0) {
      return Option.none;
    }

    return mapToReadModel({
      archives: result.archives,
      identifiantProjetValueType: identifiantProjet,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = ({
  archives,
  identifiantProjetValueType,
}: {
  archives: Array<GarantiesFinancièresDetailsEntity>;
  identifiantProjetValueType: IdentifiantProjet.ValueType;
}): ConsulterArchivesGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  archives: archives.map((garantiesFinancières) =>
    mapGarantiesFinancièresToReadModel({
      garantiesFinancières,
      identifiantProjetValueType,
    }),
  ),
});
