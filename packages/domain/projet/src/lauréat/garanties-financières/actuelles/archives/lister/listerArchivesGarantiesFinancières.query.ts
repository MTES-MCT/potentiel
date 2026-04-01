import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../../../index.js';
import {
  GarantiesFinancières,
  GarantiesFinancièresEntity,
  MotifArchivageGarantiesFinancières,
  DocumentGarantiesFinancières,
} from '../../../index.js';

export type ArchiveGarantiesFinancièresListItemReadModel = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  document?: DocumentProjet.ValueType;
  validéLe: DateTime.ValueType;
  motif: MotifArchivageGarantiesFinancières.ValueType;
};

export type ListerArchivesGarantiesFinancièresReadModel =
  Array<ArchiveGarantiesFinancièresListItemReadModel>;

export type ListerArchivesGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ListerArchivesGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  ListerArchivesGarantiesFinancièresReadModel
>;

export type ListerArchivesGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerListerArchivesGarantiesFinancièresQuery = ({
  find,
}: ListerArchivesGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ListerArchivesGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return [];
    }

    return mapToReadModel(result);
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.Query.ListerArchivesGarantiesFinancières',
    handler,
  );
};

const mapToReadModel = ({
  archives,
  identifiantProjet,
}: GarantiesFinancièresEntity): ListerArchivesGarantiesFinancièresReadModel =>
  archives
    .map((archive) => {
      const garantiesFinancières = GarantiesFinancières.convertirEnValueType(
        archive.garantiesFinancières,
      );
      return {
        garantiesFinancières,
        motif: MotifArchivageGarantiesFinancières.convertirEnValueType(archive.motifArchivage),
        validéLe: DateTime.convertirEnValueType(archive.validéLe),
        document: garantiesFinancières.estConstitué()
          ? DocumentGarantiesFinancières.attestationActuelle({
              identifiantProjet,
              enregistréLe: garantiesFinancières.constitution.date.formatter(),
              attestation: garantiesFinancières.constitution.attestation,
            })
          : undefined,
      };
    })
    .sort((a, b) => (a.validéLe.estAntérieurÀ(b.validéLe) ? 1 : -1));
