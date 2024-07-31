import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';

import {
  GarantiesFinancièresReadModel,
  mapGarantiesFinancièresToReadModel,
} from '../consulter/consulterGarantiesFinancières.query';
import { ArchivesGarantiesFinancièresEntity } from '../archivesGarantiesFinancières.entity';
import { GarantiesFinancièresDetails } from '../types';

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

    const result = await find<ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
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

type MapToReadModel = {
  archives: Array<GarantiesFinancièresDetails>;
  identifiantProjetValueType: IdentifiantProjet.ValueType;
};

const mapToReadModel = ({
  archives,
  identifiantProjetValueType,
}: MapToReadModel): ConsulterArchivesGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  archives: archives.map((garantiesFinancières) =>
    mapGarantiesFinancièresToReadModel({
      garantiesFinancières,
      identifiantProjetValueType,
    }),
  ),
});
