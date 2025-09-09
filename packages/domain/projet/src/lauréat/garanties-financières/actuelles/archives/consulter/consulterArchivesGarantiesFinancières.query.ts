import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { DocumentProjet } from '@potentiel-domain/document';

import { Candidature, IdentifiantProjet, Lauréat } from '../../../../..';
import {
  DétailsGarantiesFinancièresReadModel,
  MotifArchivageGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
} from '../../..';
import {
  ArchiveGarantiesFinancières,
  ArchivesGarantiesFinancièresEntity,
} from '../archivesGarantiesFinancières.entity';

export type ConsulterArchivesGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  archives: Array<
    DétailsGarantiesFinancièresReadModel & {
      motif: MotifArchivageGarantiesFinancières.ValueType;
    }
  >;
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
  archives: ReadonlyArray<ArchiveGarantiesFinancières>;
  identifiantProjetValueType: IdentifiantProjet.ValueType;
};

const mapToReadModel = ({
  archives,
  identifiantProjetValueType,
}: MapToReadModel): ConsulterArchivesGarantiesFinancièresReadModel => ({
  identifiantProjet: identifiantProjetValueType,
  archives: archives
    .map((archiveGf) =>
      mapToArchiveGarantiesFinancièresReadModel(identifiantProjetValueType, archiveGf),
    )
    .sort((a, b) => (a.dernièreMiseÀJour.date.estAntérieurÀ(b.dernièreMiseÀJour.date) ? 1 : -1)),
});

const mapToArchiveGarantiesFinancièresReadModel = (
  identifiantProjetValueType: IdentifiantProjet.ValueType,
  garantiesFinancières: ArchiveGarantiesFinancières,
) => ({
  motif: MotifArchivageGarantiesFinancières.convertirEnValueType(garantiesFinancières.motif),
  statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.convertirEnValueType(
    garantiesFinancières.statut,
  ),
  type: Candidature.TypeGarantiesFinancières.convertirEnValueType(garantiesFinancières.type),
  ...(garantiesFinancières.dateÉchéance && {
    dateÉchéance: DateTime.convertirEnValueType(garantiesFinancières.dateÉchéance),
  }),
  dateConstitution: garantiesFinancières.dateConstitution
    ? DateTime.convertirEnValueType(garantiesFinancières.dateConstitution)
    : undefined,
  soumisLe: garantiesFinancières.soumisLe
    ? DateTime.convertirEnValueType(garantiesFinancières.soumisLe)
    : undefined,
  validéLe: garantiesFinancières.validéLe
    ? DateTime.convertirEnValueType(garantiesFinancières.validéLe)
    : undefined,
  attestation:
    garantiesFinancières.dateConstitution && garantiesFinancières.attestation
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValueType.formatter(),
          TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
          DateTime.convertirEnValueType(garantiesFinancières.dateConstitution).formatter(),
          garantiesFinancières.attestation.format,
        )
      : undefined,
  dernièreMiseÀJour: {
    date: DateTime.convertirEnValueType(garantiesFinancières.dernièreMiseÀJour.date),
    par: garantiesFinancières.dernièreMiseÀJour.par
      ? Email.convertirEnValueType(garantiesFinancières.dernièreMiseÀJour.par)
      : undefined,
  },
});
