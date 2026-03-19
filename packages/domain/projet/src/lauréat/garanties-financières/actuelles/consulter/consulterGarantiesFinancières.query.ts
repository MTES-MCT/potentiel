import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { GarantiesFinancièresEntity } from '../../garantiesFinancières.entity.js';
import {
  GarantiesFinancières,
  MotifDemandeGarantiesFinancières,
  StatutGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
} from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';

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
}: MapToReadModelProps): ConsulterGarantiesFinancièresReadModel => {
  const garantiesFinancières = GarantiesFinancières.convertirEnValueType(actuelles);
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    statut: StatutGarantiesFinancières.convertirEnValueType(statut),
    garantiesFinancières,
    soumisLe: soumisLe ? DateTime.convertirEnValueType(soumisLe) : undefined,
    validéLe: DateTime.convertirEnValueType(actuelles.validéLe),
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
  };
};
