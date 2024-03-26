import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-librairies/monads';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import {
  StatutDépôtGarantiesFinancières,
  TypeDocumentGarantiesFinancières,
  TypeGarantiesFinancières,
} from '..';
import { AucunesGarantiesFinancièresPourLeProjetError } from '../aucunesGarantiesFinancièresPourLeProjet.error';
import { GarantiesFinancièresEntity } from '../garantiesFinancières.entity';
import { DocumentProjet } from '@potentiel-domain/document';
import { Find } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type DépôtGarantiesFinancières = {
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  statut: StatutDépôtGarantiesFinancières.ValueType;
  dateConstitution: DateTime.ValueType;
  attestation: DocumentProjet.ValueType;
  soumisLe: DateTime.ValueType;
  dernièreMiseÀJour: {
    date: DateTime.ValueType;
    par: IdentifiantUtilisateur.ValueType;
  };
};

export type ConsulterGarantiesFinancièresReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actuelles?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    attestation?: DocumentProjet.ValueType;
    dateConstitution?: DateTime.ValueType;
    soumisLe?: DateTime.ValueType;
    validéLe?: DateTime.ValueType;
    dernièreMiseÀJour: {
      date: DateTime.ValueType;
      par: IdentifiantUtilisateur.ValueType;
    };
  };
  dépôts: Array<DépôtGarantiesFinancières>;
};

export type ConsulterGarantiesFinancièresQuery = Message<
  'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
  {
    identifiantProjetValue: string;
  },
  ConsulterGarantiesFinancièresReadModel
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

    if (Option.isNone(result)) {
      throw new AucunesGarantiesFinancièresPourLeProjetError();
    }

    console.log('TEST QUERY result', result);

    const actuelles: ConsulterGarantiesFinancièresReadModel['actuelles'] = result.actuelles && {
      type: TypeGarantiesFinancières.convertirEnValueType(result.actuelles.type),
      ...(result.actuelles.dateÉchéance && {
        dateÉchéance: DateTime.convertirEnValueType(result.actuelles.dateÉchéance),
      }),
      dateConstitution: result.actuelles.dateConstitution
        ? DateTime.convertirEnValueType(result.actuelles.dateConstitution)
        : undefined,
      soumisLe: result.actuelles.soumisLe
        ? DateTime.convertirEnValueType(result.actuelles.soumisLe)
        : undefined,
      validéLe: result.actuelles.validéLe
        ? DateTime.convertirEnValueType(result.actuelles.validéLe)
        : undefined,
      attestation:
        result.actuelles.dateConstitution && result.actuelles.attestation
          ? DocumentProjet.convertirEnValueType(
              identifiantProjet.formatter(),
              TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
              DateTime.convertirEnValueType(result.actuelles.dateConstitution).formatter(),
              result.actuelles.attestation.format,
            )
          : undefined,
      dernièreMiseÀJour: {
        date: DateTime.convertirEnValueType(result.actuelles.dernièreMiseÀJour.date),
        par: IdentifiantUtilisateur.convertirEnValueType(result.actuelles.dernièreMiseÀJour.par),
      },
    };

    const dépôts: ConsulterGarantiesFinancièresReadModel['dépôts'] = result.dépôts.map(
      ({
        type,
        dateÉchéance,
        dateConstitution,
        attestation,
        dernièreMiseÀJour: { par, date },
        soumisLe,
        statut,
      }) => ({
        type: TypeGarantiesFinancières.convertirEnValueType(type),
        dateÉchéance: dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined,
        dateConstitution: DateTime.convertirEnValueType(dateConstitution),
        attestation: DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
          DateTime.convertirEnValueType(dateConstitution).formatter(),
          attestation.format,
        ),
        dernièreMiseÀJour: {
          date: DateTime.convertirEnValueType(date),
          par: IdentifiantUtilisateur.convertirEnValueType(par),
        },
        soumisLe: DateTime.convertirEnValueType(soumisLe),
        statut: StatutDépôtGarantiesFinancières.convertirEnValueType(statut),
      }),
    );
    return {
      identifiantProjet,
      actuelles,
      dépôts,
    };
  };
  mediator.register('Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières', handler);
};
