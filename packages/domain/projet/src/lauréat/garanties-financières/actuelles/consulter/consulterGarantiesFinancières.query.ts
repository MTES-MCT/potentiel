import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { GarantiesFinancièresEntity } from '../../garantiesFinancières.entity.js';
import {
  GarantiesFinancières,
  MotifArchivageGarantiesFinancières,
  MotifDemandeGarantiesFinancières,
  StatutGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

export type ArchiveGarantiesFinancièresReadModel = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  document?: DocumentProjet.ValueType;
  validéLe?: DateTime.ValueType;
  motifArchivage: MotifArchivageGarantiesFinancières.ValueType;
};

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  garantiesFinancières: GarantiesFinancières.ValueType;
  statut: StatutGarantiesFinancières.ValueType;
  motifEnAttente?: MotifDemandeGarantiesFinancières.ValueType;
  dateLimiteSoumission?: DateTime.ValueType;
  document?: DocumentProjet.ValueType;
  soumisLe?: DateTime.ValueType;
  validéLe?: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par?: Email.ValueType;
  };
  archives: ArchiveGarantiesFinancièresReadModel[];
};

export type ConsulterGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterGarantiesFinancièresReadModel>
>;

export type ConsulterGarantiesFinancièresDependencies = {
  find: Find;
};

export const registerConsulterGarantiesFinancièresQuery = ({
  find,
}: ConsulterGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<ConsulterGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const result = await find<GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result) || !result.actuelles) {
      return Option.none;
    }

    return mapToReadModel({ ...result, actuelles: result.actuelles });
  };
  mediator.register('Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières', handler);
};

type MapToReadModelProps = GarantiesFinancièresEntity & { actuelles: GarantiesFinancières.RawType };
export const mapToReadModel = ({
  identifiantProjet,
  dernièreMiseÀJour,
  statut,
  enAttente,
  actuelles,
  soumisLe,
  validéLe,
  archives,
}: MapToReadModelProps): ConsulterGarantiesFinancièresReadModel => {
  const garantiesFinancières = GarantiesFinancières.convertirEnValueType(actuelles);
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    statut: StatutGarantiesFinancières.convertirEnValueType(statut),
    garantiesFinancières,
    soumisLe: soumisLe ? DateTime.convertirEnValueType(soumisLe) : undefined,
    validéLe: validéLe ? DateTime.convertirEnValueType(validéLe) : undefined,
    document: garantiesFinancières.estConstitué()
      ? DocumentProjet.convertirEnValueType(
          identifiantProjet,
          TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
          garantiesFinancières.constitution.date.formatter(),
          garantiesFinancières.constitution.attestation.format,
        )
      : undefined,
    dernièreMiseÀJour: {
      date: DateTime.convertirEnValueType(dernièreMiseÀJour.date),
      par: dernièreMiseÀJour.par ? Email.convertirEnValueType(dernièreMiseÀJour.par) : undefined,
    },
    motifEnAttente: enAttente
      ? MotifDemandeGarantiesFinancières.convertirEnValueType(enAttente.motif)
      : undefined,
    dateLimiteSoumission: enAttente?.dateLimiteSoumission
      ? DateTime.convertirEnValueType(enAttente.dateLimiteSoumission)
      : undefined,
    archives: archives.map((archive) => {
      const garantiesFinancières = GarantiesFinancières.convertirEnValueType(
        archive.garantiesFinancières,
      );
      return {
        garantiesFinancières,
        motifArchivage: MotifArchivageGarantiesFinancières.convertirEnValueType(
          archive.motifArchivage,
        ),
        validéLe: archive.validéLe && DateTime.convertirEnValueType(archive.validéLe),
        document: garantiesFinancières.estConstitué()
          ? DocumentProjet.convertirEnValueType(
              identifiantProjet,
              TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
              garantiesFinancières.constitution.date.formatter(),
              garantiesFinancières.constitution.attestation.format,
            )
          : undefined,
      };
    }),
  };
};
