import { Candidature } from '@potentiel-domain/candidature';
import { StatutProjet } from '@potentiel-domain/common';

export const mapExampleToUseCaseDefaultValues = (
  nomProjet: string,
  exemple: Record<string, string>,
) => {
  const appelOffre = exemple["appel d'offre"] ?? 'PPE2 - Eolien';
  const période = exemple['période'] ?? '1';
  const famille = exemple['famille'] ?? '';
  const numéroCRE = exemple['numéro CRE'] ?? '23';
  const statut = exemple['statut'] ?? 'classé';

  return {
    values: {
      appelOffreValue: appelOffre,
      périodeValue: période,
      familleValue: famille,
      numéroCREValue: numéroCRE,
      statutValue: statut,
      motifÉliminationValue: (statut as StatutProjet.RawType) === 'classé' ? 'Motif' : '',
      typeGarantiesFinancièresValue: exemple['type GF'] ?? 'consignation',
      nomProjetValue: nomProjet,
      nomCandidatValue: exemple['nom candidat'] ?? 'Candidat',
      technologieValue: exemple['technologie'] ?? 'N/A',
      emailContactValue: exemple['email contact'] ?? 'porteur@test.test',
      codePostalValue: exemple['code postal'] ?? '13000',
      communeValue: exemple['commune'] ?? 'MARSEILLE',
      adresse1Value: exemple['adresse 1'] ?? '5 avenue laeticia',
      adresse2Value: exemple['adresse 2'] ?? '',
      puissanceALaPointeValue: exemple['puissance à la Pointe'] === 'oui',
      sociétéMèreValue: exemple['société mère'] ?? '',
      territoireProjetValue: exemple['territoire projet'] ?? '',
      dateÉchéanceGfValue: exemple['date échéance GF'] ?? '',
      historiqueAbandonValue:
        exemple['historique abandon'] ?? Candidature.HistoriqueAbandon.types[3],
      puissanceProductionAnnuelleValue: Number(exemple['puissance production annuelle']) || 1,
      prixReferenceValue: Number(exemple['prix reference']) || 1,
      noteTotaleValue: Number(exemple['note totale']) || 1,
      nomReprésentantLégalValue: exemple['nomReprésentant légal'] ?? '',
      evaluationCarboneSimplifiéeValue: Number(exemple['evaluation carbone simplifiée']) || 1,
      valeurÉvaluationCarboneValue: Number(exemple['valeur évalutation carbone']) || 1,
      financementCollectifValue: exemple['financement collectif'] === 'oui',
      gouvernancePartagéeValue: exemple['gouvernance partagée'] === 'oui',
      financementParticipatifValue: exemple['financement participatif'] === 'oui',
      détailsValue: {},
    },
    identifiantProjet: `${appelOffre}#${période}#${famille}#${numéroCRE}`,
  };
};
