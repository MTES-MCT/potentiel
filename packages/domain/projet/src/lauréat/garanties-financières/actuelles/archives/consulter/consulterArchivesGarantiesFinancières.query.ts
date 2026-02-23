import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../../../../index.js';
import {
  ConsulterGarantiesFinancièresReadModel,
  MotifArchivageGarantiesFinancières,
} from '../../../index.js';
import {
  ArchiveGarantiesFinancières,
  ArchivesGarantiesFinancièresEntity,
} from '../archivesGarantiesFinancières.entity.js';
import { mapToReadModel as mapToConsulterReadModel } from '../../consulter/consulterGarantiesFinancières.query.js';

export type ArchiveGarantiesFinancièresListItemReadModel =
  ConsulterGarantiesFinancièresReadModel & {
    motif: MotifArchivageGarantiesFinancières.ValueType;
  };

export type ConsulterArchivesGarantiesFinancièresReadModel =
  Array<ArchiveGarantiesFinancièresListItemReadModel>;

export type ConsulterArchivesGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  ConsulterArchivesGarantiesFinancièresReadModel
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
      return [];
    }

    return mapToReadModel({
      archives: result.archives,
      identifiantProjet,
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ConsulterArchivesGarantiesFinancières',
    handler,
  );
};

type MapToReadModel = {
  archives: ReadonlyArray<ArchiveGarantiesFinancières>;
  identifiantProjet: IdentifiantProjet.ValueType;
};

const mapToReadModel = ({
  archives,
  identifiantProjet,
}: MapToReadModel): ConsulterArchivesGarantiesFinancièresReadModel =>
  archives
    .map((archiveGf) => {
      const readModel = mapToConsulterReadModel({
        garantiesFinancières: archiveGf,
        identifiantProjet,
      });
      return {
        ...readModel,
        motif: MotifArchivageGarantiesFinancières.convertirEnValueType(archiveGf.motif),
      };
    })
    .sort((a, b) => (a.dernièreMiseÀJour.date.estAntérieurÀ(b.dernièreMiseÀJour.date) ? 1 : -1));
