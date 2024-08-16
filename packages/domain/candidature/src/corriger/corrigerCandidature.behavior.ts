import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import { GarantiesFinancièresRequisesPourAppelOffreError } from '../garantiesFinancièresRequises.error';
import {
  AppelOffreInexistantError,
  FamillePériodeAppelOffreInexistanteError,
  PériodeAppelOffreInexistanteError,
} from '../appelOffreInexistant.error';
import { CandidatureNonModifiéeError } from '../candidatureNonModifiée.error';
import {
  CandidatureImportéeBehaviorPayload,
  ImporterCandidatureBehaviorOptions,
  mapToEventPayload,
} from '../importer/importerCandidature.behavior';

type CandidatureCorrigéePayload = CandidatureImportéeBehaviorPayload;

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

  const période = appelOffre.periodes.find((x) => x.id === candidature.période);
  if (!période) {
    throw new PériodeAppelOffreInexistanteError(candidature.appelOffre, candidature.période);
  }

  let famille: AppelOffre.Famille | undefined;
  if (candidature.famille) {
    famille = période.familles.find((x) => x.id === candidature.famille);
    if (!famille) {
      throw new FamillePériodeAppelOffreInexistanteError(
        candidature.appelOffre,
        candidature.période,
        candidature.famille,
      );
    }
  }

  const soumisAuxGF =
    famille?.soumisAuxGarantiesFinancieres ?? appelOffre.soumisAuxGarantiesFinancieres;
  if (
    soumisAuxGF === 'à la candidature' &&
    candidature.statut.estClassé() &&
    !candidature.typeGarantiesFinancières
  ) {
    throw new GarantiesFinancièresRequisesPourAppelOffreError();
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
