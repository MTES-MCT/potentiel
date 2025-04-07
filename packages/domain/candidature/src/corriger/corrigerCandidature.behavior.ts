import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import { CandidatureImportéeEventCommonPayload } from '../importer/importerCandidature.behavior';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';
import { TypeActionnariat, TypeTechnologie } from '../candidature';

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
  this.emailContact = Email.convertirEnValueType(payload.emailContact);
  this.prixRéférence = payload.prixReference;
  this.sociétéMère = payload.sociétéMère;
  this.nomReprésentantLégal = payload.nomReprésentantLégal;
  this.puissance = payload.puissanceProductionAnnuelle;
  this.note = payload.noteTotale;
  this.technologie = TypeTechnologie.convertirEnValueType(payload.technologie);
}
