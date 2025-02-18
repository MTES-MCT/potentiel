import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import {
  DateÉchéanceGarantiesFinancièresRequiseError,
  DateÉchéanceNonAttendueError,
  GarantiesFinancièresRequisesPourAppelOffreError,
} from '../garantiesFinancières.error';
import { AppelOffreInexistantError } from '../appelOffreInexistant.error';
import { CandidatureNonModifiéeError } from '../candidatureNonModifiée.error';
import {
  CandidatureImportéeEventCommonPayload,
  ImporterCandidatureBehaviorCommonOptions,
  mapToEventPayload,
} from '../importer/importerCandidature.behavior';
import { AttestationNonGénéréeError } from '../attestationNonGénérée.error';
import { CandidatureNonTrouvéeError } from '../candidatureNonTrouvée.error';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import { TypeActionnariat } from '../candidature';

type CandidatureCorrigéePayload = CandidatureImportéeEventCommonPayload & {
  corrigéLe: DateTime.RawType;
  corrigéPar: Email.RawType;
  doitRégénérerAttestation?: true;
  détailsMisÀJour?: true;
};

export type CandidatureCorrigéeEvent = DomainEvent<
  'CandidatureCorrigée-V1',
  CandidatureCorrigéePayload
>;

type CorrigerCandidatureOptions = ImporterCandidatureBehaviorCommonOptions & {
  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
  doitRégénérerAttestation?: true;
  détailsMisÀJour?: true;
};

export async function corriger(
  this: CandidatureAggregate,
  candidature: CorrigerCandidatureOptions,
  appelOffre: Option.Type<AppelOffre.AppelOffreReadModel>,
) {
  if (!this.importé) {
    throw new CandidatureNonTrouvéeError();
  }
  if (Option.isNone(appelOffre)) {
    throw new AppelOffreInexistantError(candidature.identifiantProjet.appelOffre);
  }

  const famille = this.récupererFamilleAO(
    appelOffre,
    candidature.identifiantProjet.période,
    candidature.identifiantProjet.famille,
  );

  const soumisAuxGF =
    famille?.soumisAuxGarantiesFinancieres ?? appelOffre.soumisAuxGarantiesFinancieres;
  if (
    soumisAuxGF === 'à la candidature' &&
    candidature.statut.estClassé() &&
    !candidature.typeGarantiesFinancières
  ) {
    throw new GarantiesFinancièresRequisesPourAppelOffreError();
  }

  if (
    candidature.statut.estClassé() &&
    candidature.typeGarantiesFinancières &&
    candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
    !candidature.dateÉchéanceGf
  ) {
    throw new DateÉchéanceGarantiesFinancièresRequiseError();
  }

  if (
    candidature.statut.estClassé() &&
    candidature.typeGarantiesFinancières &&
    !candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
    candidature.dateÉchéanceGf
  ) {
    throw new DateÉchéanceNonAttendueError();
  }

  if (this.estNotifiée) {
    if (!candidature.statut.estÉgaleÀ(this.statut)) {
      throw new StatutNonModifiableAprèsNotificationError();
    }

    if (candidature.typeGarantiesFinancières) {
      if (
        !this.garantiesFinancières?.type ||
        !this.garantiesFinancières?.type.estÉgaleÀ(candidature.typeGarantiesFinancières)
      ) {
        throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
      }
    } else if (this.garantiesFinancières?.type) {
      throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
    }
  }
  if (!this.estNotifiée && candidature.doitRégénérerAttestation) {
    throw new AttestationNonGénéréeError();
  }

  const event: CandidatureCorrigéeEvent = {
    type: 'CandidatureCorrigée-V1',
    payload: {
      ...mapToEventPayload(candidature),
      corrigéLe: candidature.corrigéLe.formatter(),
      corrigéPar: candidature.corrigéPar.formatter(),
      doitRégénérerAttestation: candidature.doitRégénérerAttestation,
      détailsMisÀJour: candidature.détailsMisÀJour,
    },
  };

  if (this.estIdentiqueÀ(event.payload)) {
    throw new CandidatureNonModifiéeError(candidature.nomProjet);
  }

  await this.publish(event);
}

export function applyCandidatureCorrigée(
  this: CandidatureAggregate,
  { payload }: CandidatureCorrigéeEvent,
) {
  this.importé = true;
  this.statut = StatutCandidature.convertirEnValueType(payload.statut);
  this.nomProjet = payload.nomProjet;
  this.localité = payload.localité;
  if (payload.typeGarantiesFinancières) {
    this.garantiesFinancières = {
      type: TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancières),
      dateEchéance: payload.dateÉchéanceGf
        ? DateTime.convertirEnValueType(payload.dateÉchéanceGf)
        : undefined,
    };
  }
  this.payloadHash = this.calculerHash(payload);
  this.typeActionnariat = payload.actionnariat
    ? TypeActionnariat.convertirEnValueType(payload.actionnariat)
    : undefined;
}

class StatutNonModifiableAprèsNotificationError extends InvalidOperationError {
  constructor() {
    super(`Le statut d'une candidature ne peut être modifié après la notification`);
  }
}

class TypeGarantiesFinancièresNonModifiableAprèsNotificationError extends InvalidOperationError {
  constructor() {
    super(
      `Le type de garanties financières d'une candidature ne peut être modifié après la notification`,
    );
  }
}
