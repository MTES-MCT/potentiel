import type { ProjetPourAchevementV2 } from '@potentiel-applications/api-documentation';
import type { Lauréat } from '@potentiel-domain/projet';

export const mapToDonneesProjetPourAchevement = ({
  identifiantProjet,
  nomProjet,
  nomCandidat,
  dateNotification,
  sociétéMère,
  siren,
  siret,
  dossiersRaccordement,
  puissance,
  puissanceInitiale,
  cahierDesCharges,
  localité,
  représentantLégal,
  emailPorteurs,
  typeActionnariat,
  prix,
  coefficientKChoisi,
  presenceDeTrackers,
  gestionnaireRéseau,
  typologieInstallation,
  statut,
  achèvementEnAttente,
  technologie,
  coordonnéesGéodésiques,
  natureDeLExploitation,
  évaluationCarboneSimplifiée,
  typeDeTerrain,
}: Lauréat.Achèvement.DonnéesProjetPourAchèvementReadModel): ProjetPourAchevementV2 => ({
  identifiantProjet: identifiantProjet.formatter(),
  appelOffre: identifiantProjet.appelOffre,
  periode: identifiantProjet.période,
  famille: identifiantProjet.famille,
  nomProjet,
  numeroCre: identifiantProjet.numéroCRE,
  nomCandidat,
  dateNotification: dateNotification.formatterDate(),
  societeMere: sociétéMère,
  identification: siren || siret ? { siren, siret } : undefined,
  dossiersRaccordement: dossiersRaccordement.map(
    ({ référence, dateDemandeComplète, dateMiseEnService }) => ({
      reference: référence.formatter(),
      dateDemandeComplete: dateDemandeComplète?.formatterDate(),
      dateMiseEnService: dateMiseEnService?.formatterDate(),
    }),
  ),
  puissance,
  puissanceInitiale,
  cahierDesCharges: cahierDesCharges.formatter(),
  siteDeProduction: {
    adresse1: localité.adresse1,
    adresse2: localité.adresse2,
    codePostal: localité.codePostal,
    commune: localité.commune,
    departement: localité.département,
    region: localité.région,
  },
  representantLegal: représentantLégal
    ? { nom: représentantLégal.nom, typeRepresentantLegal: représentantLégal.type.formatter() }
    : undefined,
  emailPorteurs: emailPorteurs.map((email) => email.formatter()),
  typeActionnariat: typeActionnariat?.formatter(),
  prix,
  coefficientKChoisi,
  presenceDeTrackers,
  gestionnaireReseau: gestionnaireRéseau
    ? {
        raisonSociale: gestionnaireRéseau.raisonSociale,
        codeEic: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
      }
    : undefined,
  typologieInstallation: typologieInstallation.map(({ typologie }) => typologie),
  statut: statut.formatter(),
  achevementEnAttente: achèvementEnAttente,
  technologie: technologie.type === 'N/A' ? undefined : technologie.type,
  coordonneesGeodesiques: coordonnéesGéodésiques,
  natureDeLExploitation: natureDeLExploitation
    ? {
        typeNatureDeLExploitation: natureDeLExploitation.type.formatter(),
        tauxPrevisionnelAci: natureDeLExploitation.tauxPrévisionnelACI,
        tauxPrevisionnelAcc: natureDeLExploitation.tauxPrévisionnelACC,
      }
    : undefined,
  evaluationCarboneSimplifiee: évaluationCarboneSimplifiée,
  typeDeTerrain,
});
