import { DateTime, Email } from '@potentiel-domain/common';

import { Fournisseur } from '../../lauréat/fournisseur';
import {
  HistoriqueAbandon,
  StatutCandidature,
  TypeActionnariat,
  TypeGarantiesFinancières,
  TypeInstallationsAgrivoltaiques,
  TypeTechnologie,
  TypologieBâtiment,
} from '..';

export type ImporterCandidatureOptions = {
  statut: StatutCandidature.ValueType;
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  historiqueAbandon: HistoriqueAbandon.ValueType;
  nomProjet: string;
  sociétéMère: string;
  nomCandidat: string;
  puissanceProductionAnnuelle: number;
  prixRéférence: number;
  noteTotale: number;
  nomReprésentantLégal: string;
  emailContact: Email.ValueType;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  motifÉlimination: string | undefined;
  puissanceALaPointe: boolean;
  evaluationCarboneSimplifiée: number;
  technologie: TypeTechnologie.ValueType;
  actionnariat: TypeActionnariat.ValueType | undefined;
  dateÉchéanceGf: DateTime.ValueType | undefined;
  territoireProjet: string;
  coefficientKChoisi: boolean | undefined;
  typeInstallationsAgrivoltaiques: TypeInstallationsAgrivoltaiques.ValueType | undefined;
  élémentsSousOmbrière: string | undefined;
  typologieDeBâtiment: TypologieBâtiment.ValueType | undefined;
  obligationDeSolarisation: boolean | undefined;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
  fournisseurs: Array<Fournisseur.ValueType>;
};
