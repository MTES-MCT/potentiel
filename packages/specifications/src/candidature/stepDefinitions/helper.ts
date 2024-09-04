import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

type MapExampleToUseCaseDefaultValues = {
  values: Omit<Candidature.ImporterCandidatureUseCase['data'], 'importéLe' | 'importéPar'>;
  identifiantProjet: IdentifiantProjet.RawType;
};
export const mapExampleToUseCaseDefaultValues = (
  nomProjet: string,
  exemple: Record<string, string>,
): MapExampleToUseCaseDefaultValues => {
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
      localitéValue: {
        adresse1: exemple['adresse 1'] ?? '5 avenue laeticia',
        adresse2: exemple['adresse 2'] ?? '',
        codePostal: exemple['code postal'] ?? '75000',
        commune: exemple['commune'] ?? 'Marseille',
        région: exemple['région'] ?? "Provence-Alpes-Côte d'Azur",
        département: exemple['département'] ?? '13',
      },
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
      détailsValue: {
        'Rendement nominal': '1234',
      },
    },
    identifiantProjet: `${appelOffre}#${période}#${famille}#${numéroCRE}`,
  };
};
