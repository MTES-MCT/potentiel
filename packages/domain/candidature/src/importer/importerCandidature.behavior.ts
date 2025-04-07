import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';
import * as StatutCandidature from '../statutCandidature.valueType';
import * as TypeTechnologie from '../typeTechnologie.valueType';
import * as TypeActionnariat from '../typeActionnariat.valueType';
import * as HistoriqueAbandon from '../historiqueAbandon.valueType';
import * as TypeGarantiesFinancières from '../typeGarantiesFinancières.valueType';

export type CandidatureImportéeEventCommonPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  statut: StatutCandidature.RawType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.RawType;
  historiqueAbandon: HistoriqueAbandon.RawType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixReference: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: Email.RawType;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  motifÉlimination?: string;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.RawType;
  actionnariat?: TypeActionnariat.RawType;
  dateÉchéanceGf?: DateTime.RawType;
  territoireProjet: string;
  coefficientKChoisi?: boolean;
};

type CandidatureImportéeEventPayload = CandidatureImportéeEventCommonPayload & {
  importéLe: DateTime.RawType;
  importéPar: Email.RawType;
};

export type CandidatureImportéeEvent = DomainEvent<
  'CandidatureImportée-V1',
  CandidatureImportéeEventPayload
>;

export function applyCandidatureImportée(
  this: CandidatureAggregate,
  { payload }: CandidatureImportéeEvent,
) {
  this.importé = true;
  this.statut = StatutCandidature.convertirEnValueType(payload.statut);
  this.nomProjet = payload.nomProjet;
  this.localité = payload.localité;
  this.garantiesFinancières = payload.typeGarantiesFinancières
    ? {
        type: TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancières),
        dateEchéance:
          payload.dateÉchéanceGf && DateTime.convertirEnValueType(payload.dateÉchéanceGf),
      }
    : undefined;
  this.payloadHash = this.calculerHash(payload);

  this.nomReprésentantLégal = payload.nomReprésentantLégal;
  this.sociétéMère = payload.sociétéMère;
  this.puissance = payload.puissanceProductionAnnuelle;
  this.typeActionnariat = payload.actionnariat
    ? TypeActionnariat.convertirEnValueType(payload.actionnariat)
    : undefined;
  this.emailContact = Email.convertirEnValueType(payload.emailContact);
  this.prixRéférence = payload.prixReference;
  this.note = payload.noteTotale;
  this.technologie = TypeTechnologie.convertirEnValueType(payload.technologie);
}
