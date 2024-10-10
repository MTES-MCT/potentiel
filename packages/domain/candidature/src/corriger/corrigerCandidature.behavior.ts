import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import {
  DateÉchéanceGarantiesFinancièresRequiseError,
  GarantiesFinancièresRequisesPourAppelOffreError,
} from '../garantiesFinancièresRequises.error';
import { AppelOffreInexistantError } from '../appelOffreInexistant.error';
import { CandidatureNonModifiéeError } from '../candidatureNonModifiée.error';
import {
  CandidatureImportéeEventCommonPayload,
  ImporterCandidatureBehaviorCommonOptions,
  mapToEventPayload,
} from '../importer/importerCandidature.behavior';
import { AttestationNonGénéréeError } from '../attestationNonGénérée.error';

type CandidatureCorrigéePayload = CandidatureImportéeEventCommonPayload & {
  corrigéLe: DateTime.RawType;
  corrigéPar: Email.RawType;
  doitRégénérerAttestation?: true;
};

export type CandidatureCorrigéeEvent = DomainEvent<
  'CandidatureCorrigée-V1',
  CandidatureCorrigéePayload
>;

type CorrigerCandidatureOptions = ImporterCandidatureBehaviorCommonOptions & {
  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
  doitRégénérerAttestation?: true;
};

export async function corriger(
  this: CandidatureAggregate,
  candidature: CorrigerCandidatureOptions,
  appelOffre: Option.Type<AppelOffre.AppelOffreReadModel>,
) {
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
    candidature.typeGarantiesFinancières &&
    candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
    !candidature.dateÉchéanceGf
  ) {
    throw new DateÉchéanceGarantiesFinancièresRequiseError();
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
  this.payloadHash = this.calculerHash(payload);
}
