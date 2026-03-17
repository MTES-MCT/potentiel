import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../../../index.js';
import {
  ArchivesGarantiesFinancièresEntity,
  ConsulterGarantiesFinancièresReadModel,
  GarantiesFinancières,
  MotifArchivageGarantiesFinancières,
  StatutGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
} from '../../../index.js';

export type ArchiveGarantiesFinancièresListItemReadModel =
  ConsulterGarantiesFinancièresReadModel & {
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

    const result = await find<ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${identifiantProjet.formatter()}`,
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
}: ArchivesGarantiesFinancièresEntity): ListerArchivesGarantiesFinancièresReadModel =>
  archives
    .map(
      ({
        statut,
        type,
        dateÉchéance,
        attestation,
        dateConstitution,
        soumisLe,
        validéLe,
        dernièreMiseÀJour,
        motif,
      }) => {
        return {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          statut: StatutGarantiesFinancières.convertirEnValueType(statut),
          garantiesFinancières: GarantiesFinancières.convertirEnValueType({
            type,
            dateÉchéance,
            attestation,
            dateConstitution,
          }),
          soumisLe: soumisLe ? DateTime.convertirEnValueType(soumisLe) : undefined,
          validéLe: validéLe ? DateTime.convertirEnValueType(validéLe) : undefined,
          document:
            dateConstitution && attestation
              ? DocumentProjet.convertirEnValueType(
                  identifiantProjet,
                  TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
                  DateTime.convertirEnValueType(dateConstitution).formatter(),
                  attestation.format,
                )
              : undefined,
          dernièreMiseÀJour: {
            date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
            par: dernièreMiseÀJour.par
              ? Email.convertirEnValueType(dernièreMiseÀJour.par)
              : undefined,
          },
          motif: MotifArchivageGarantiesFinancières.convertirEnValueType(motif),
        };
      },
    )
    .sort((a, b) => (a.dernièreMiseÀJour.date.estAntérieurÀ(b.dernièreMiseÀJour.date) ? 1 : -1));
