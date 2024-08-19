import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import {
  DateÉchéanceGarantiesFinancièresRequiseError,
  GarantiesFinancièresRequisesPourAppelOffreError,
} from '../garantiesFinancièresRequises.error';
import { AppelOffreInexistantError } from '../appelOffreInexistant.error';
import { CandidatureNonModifiéeError } from '../candidatureNonModifiée.error';
import {
  CandidatureImportéeEventPayload,
  ImporterCandidatureBehaviorOptions,
  mapToEventPayload,
} from '../importer/importerCandidature.behavior';

type CandidatureCorrigéePayload = CandidatureImportéeEventPayload;

export type CandidatureCorrigéeEvent = DomainEvent<
  'CandidatureCorrigée-V1',
  CandidatureCorrigéePayload
>;

type CorrigerCandidatureOptions = ImporterCandidatureBehaviorOptions;

export async function corriger(
  this: CandidatureAggregate,
  candidature: CorrigerCandidatureOptions,
  appelOffre: Option.Type<AppelOffre.AppelOffreReadModel>,
) {
  if (Option.isNone(appelOffre)) {
    throw new AppelOffreInexistantError(candidature.appelOffre);
  }

  const famille = this.récupererFamilleAO(appelOffre, candidature.période, candidature.famille);

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

  const event: CandidatureCorrigéeEvent = {
    type: 'CandidatureCorrigée-V1',
    payload: mapToEventPayload(candidature),
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
