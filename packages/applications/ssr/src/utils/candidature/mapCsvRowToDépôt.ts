import { Candidature } from '@potentiel-domain/projet';

import { CandidatureShape } from './candidatureCsv.schema';

export const mapCsvRowToDépôt = (
  row: CandidatureShape,
): Omit<Candidature.Dépôt.RawType, 'localité' | 'fournisseurs'> => {
  return {
    typeGarantiesFinancières: row.typeGf,
    historiqueAbandon: row.historiqueAbandon,
    nomProjet: row.nomProjet,
    sociétéMère: row.sociétéMère,
    nomCandidat: row.nomCandidat,
    puissanceProductionAnnuelle: row.puissanceProductionAnnuelle,
    prixReference: row.prixRéférence,
    nomReprésentantLégal: row.nomReprésentantLégal,
    emailContact: row.emailContact,
    puissanceALaPointe: row.puissanceÀLaPointe,
    evaluationCarboneSimplifiée: row.evaluationCarboneSimplifiée,
    technologie: row.technologie,
    actionnariat: row.financementCollectif
      ? Candidature.TypeActionnariat.financementCollectif.formatter()
      : row.gouvernancePartagée
        ? Candidature.TypeActionnariat.gouvernancePartagée.formatter()
        : undefined,
    dateÉchéanceGf: row.dateÉchéanceGf,
    territoireProjet: row.territoireProjet,
    coefficientKChoisi: row.coefficientKChoisi,
    typeInstallationsAgrivoltaiques: row.installationsAgrivoltaiques,
    élémentsSousOmbrière: row.élémentsSousOmbrière,
    typologieDeBâtiment: row.typologieDeBâtiment,
    obligationDeSolarisation: row.obligationDeSolarisation,
  };
};
