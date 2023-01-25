import { literal } from 'sequelize'
import { Literal } from 'sequelize/types/utils'

export type Colonne =
  | {
      details?: undefined
      champ: string | Literal
      intitulé: string
    }
  | {
      details: true
      champ: string
    }

type Catégories =
  | 'identification projet'
  | 'coordonnées candidat'
  | 'financement citoyen'
  | 'contenu local'
  | 'localisation projet'
  | 'coordonnées géodésiques'
  | "coût d'investissement"
  | 'données autoconsommation'
  | 'données de raccordement'
  | 'données fournisseurs'
  | 'évaluation carbone'
  | 'potentiel solaire'
  | 'implantation'
  | 'prix'
  | 'instruction'
  | 'résultat instruction sensible'
  | 'note innovation'
  | 'notes'
  | 'modifications avant import'
  | 'garanties financières'
  | 'références candidature'

export const donnéesProjetParCatégorie: Record<Catégories, Colonne[]> = {
  'identification projet': [
    { champ: 'numeroCRE', intitulé: 'N°CRE' },
    { champ: 'appelOffreId', intitulé: "Appel d'offres" },
    { champ: 'periodeId', intitulé: 'Période' },
    { champ: 'familleId', intitulé: 'Famille' },
    { champ: 'nomProjet', intitulé: 'Nom projet' },
    { champ: 'nomCandidat', intitulé: 'Candidat' },
    { champ: 'actionnaire', intitulé: 'Société mère' },
    { champ: 'territoireProjet', intitulé: '"Territoire\n(AO ZNI)"' },
    { champ: `Numéro SIREN ou SIRET*`, details: true },
    { champ: `Code NACE`, details: true },
    { champ: `Nature du candidat`, details: true },
    { champ: `Type entreprise`, details: true },
    { champ: 'technologie', intitulé: 'Technologie\n(dispositif de production)' },
    { champ: `Typologie de projet`, details: true },
    {
      champ: 'puissance',
      intitulé: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
    },
    { champ: `Puissance installée (MWc)`, details: true },
    {
      champ: 'engagementFournitureDePuissanceAlaPointe',
      intitulé: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
    },
    {
      champ: `Diamètre du rotor (m)\n(AO éolien)`,
      details: true,
    },
    {
      champ: `Hauteur bout de pâle (m)\n(AO éolien)`,
      details: true,
    },
    {
      champ: `Nb d'aérogénérateurs\n(AO éolien)`,
      details: true,
    },
    {
      champ: literal(`TO_CHAR(TO_TIMESTAMP("notifiedOn" / 1000), 'DD/MM/YYYY')`),
      intitulé: 'Notification',
    },
    { champ: 'cahierDesChargesActuel', intitulé: 'cahier des charges choisi' },
    { champ: 'classe', intitulé: 'Classé ?' },
  ],
  'coordonnées candidat': [
    { champ: `Région d'implantation`, details: true },
    { champ: `Adresse`, details: true },
    { champ: 'nomRepresentantLegal', intitulé: 'Nom et prénom du représentant légal' },
    {
      champ: `Titre du représentant légal`,
      details: true,
    },
    {
      champ: `Nom et prénom du signataire du formulaire`,
      details: true,
    },
    { champ: `Nom et prénom du contact`, details: true },
    { champ: `Titre du contact`, details: true },
    {
      champ: `Adresse postale du contact`,
      details: true,
    },
    { champ: 'email', intitulé: 'Adresse électronique du contact' },
    { champ: `Téléphone`, details: true },
  ],
  'financement citoyen': [
    {
      champ: literal(`CASE WHEN "isInvestissementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
      intitulé: 'Investissement participatif (Oui/Non)',
    },
    {
      champ: literal(`CASE WHEN "isFinancementParticipatif" = 'true' THEN 'Oui' ELSE '' END`),
      intitulé: 'Financement participatif (Oui/Non)',
    },
    { champ: `€/MWh bonus participatif`, details: true },
    {
      champ: literal(`CASE WHEN "actionnariat" = 'financement-collectif' THEN 'Oui' ELSE '' END`),
      intitulé: 'Financement collectif (Oui/Non)',
    },
    {
      champ: literal(`CASE WHEN "actionnariat" = 'gouvernance-partagee' THEN 'Oui' ELSE '' END`),
      intitulé: 'Gouvernance partagée (Oui/Non)',
    },
  ],
  'contenu local': [
    {
      champ: `Contenu local français (%)\n(Cellules)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Cellules)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Plaquettes de silicium (wafers))`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Plaquettes de silicium (wafers))`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Plaquettes de silicium (wafers))`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Polysilicium)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Polysilicium)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Polysilicium)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Postes de conversion)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Postes de conversion)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Postes de conversion)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Structure)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Structure)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Structure)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Autres technologies)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Autres technologies)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Autres technologies)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Installation et mise en service )`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Installation et mise en service)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Installation et mise en service)`,
      details: true,
    },
    {
      champ: `Commentaires contenu local\n(Installation et mise en service)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(raccordement)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(raccordement)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(raccordement)`,
      details: true,
    },
    {
      champ: `Contenu local TOTAL :\ncoût total (M€)`,
      details: true,
    },
    {
      champ: `Contenu local TOTAL français (%)`,
      details: true,
    },
    {
      champ: `Contenu local TOTAL européen (%)`,
      details: true,
    },
    {
      champ: `Contenu local TOTAL :\nCommentaires`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Cellules)`,
      details: true,
    },
    {
      champ: `Coût total du lot (M€)\n(Développement)`,
      details: true,
    },
    {
      champ: `Contenu local français (%)\n(Développement)`,
      details: true,
    },
    {
      champ: `Contenu local européen (%)\n(Développement)`,
      details: true,
    },
    {
      champ: `Contenu local développement :\nCommentaires`,
      details: true,
    },
    {
      champ: `Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)`,
      details: true,
    },
    {
      champ: `Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)`,
      details: true,
    },
    {
      champ: `Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)`,
      details: true,
    },
    {
      champ: `Contenu local Fabrication de composants et assemblage :\nCommentaires`,
      details: true,
    },
  ],
  'localisation projet': [
    { champ: 'adresseProjet', intitulé: 'N°, voie, lieu-dit' },
    { champ: 'codePostalProjet', intitulé: 'CP' },
    { champ: 'communeProjet', intitulé: 'Commune' },
    { champ: `Département`, details: true },
    { champ: `Région`, details: true },
  ],
  'coordonnées géodésiques': [
    {
      champ: `Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(degrés)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(minutes)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(secondes)`,
      details: true,
    },
    {
      champ: `Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(cardinal)`,
      details: true,
    },
  ],
  "coût d'investissement": [
    { champ: `Raccordement € / kWc`, details: true },
    { champ: `Investissement total (k€)`, details: true },
    {
      champ: `dont quantité de fonds propres (k€)`,
      details: true,
    },
    {
      champ: `dont quantité d'endettement  (k€)`,
      details: true,
    },
    {
      champ: `dont quantité de subventions à l'investissement  (k€)`,
      details: true,
    },
    {
      champ: `dont quantité d'autres avantages financiers  (k€)`,
      details: true,
    },
    { champ: `Location (€/an/MWc)`, details: true },
    { champ: `CAPEX Moyen\n(k€ / MWc)`, details: true },
  ],
  'données autoconsommation': [
    {
      champ: `Taux d'autoconsommation \n(AO autoconsommation)`,
      details: true,
    },
    {
      champ: `Type de consommateur associé\n(AO autoconsommation)`,
      details: true,
    },
    {
      champ: `Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)`,
      details: true,
    },
    {
      champ: `Taux occupation toiture\n(AO autoconsommation)`,
      details: true,
    },
  ],
  'données de raccordement': [
    {
      champ: `Référence du dossier de raccordement*`,
      details: true,
    },
    {
      champ: `Date de mise en service du raccordement attendue (mm/aaaa)`,
      details: true,
    },
    {
      champ: `Capacité du raccordement (kW)`,
      details: true,
    },
    {
      champ: `Montant estimé du raccordement (k€)`,
      details: true,
    },
    {
      champ: 'dateFileAttente',
      intitulé: "Date d'entrée en file d'attente",
    },
    {
      champ: 'dateMiseEnService',
      intitulé: 'Date de mise en service',
    },
    {
      champ: 'numeroGestionnaire',
      intitulé: 'Numéro de gestionnaire réseau',
    },
  ],
  'données fournisseurs': [
    {
      champ: `Technologie (Modules ou films)`,
      details: true,
    },
    {
      champ: `Référence commerciale \n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Puissance crête (Wc) \n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Rendement nominal \n(Modules ou films)`,
      details: true,
    },
    {
      champ: `Nom du fabricant (Cellules)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication (Cellules)`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Polysilicium)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Polysilicium)`,
      details: true,
    },
    {
      champ: `Nom du fabricant (Structure)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Structure)`,
      details: true,
    },
    {
      champ: `Technologie \n(Dispositifs de stockage de l’énergie *)`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Dispositifs de stockage de l’énergie *)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)`,
      details: true,
    },
    {
      champ: `Technologie \n(Dispositifs de suivi de la course du soleil *)`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *`,
      details: true,
    },
    {
      champ: `Référence commerciale \n(Autres technologies)`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Autres technologies)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Autres technologies)`,
      details: true,
    },
    {
      champ: `Coût des modules €/Wc`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Plaquettes de silicium (wafers))`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))`,
      details: true,
    },
    {
      champ: `Nom du fabricant \n(Postes de conversion)`,
      details: true,
    },
    {
      champ: `Lieu(x) de fabrication \n(Postes de conversion)`,
      details: true,
    },
  ],
  'évaluation carbone': [
    {
      champ: 'evaluationCarbone',
      intitulé:
        'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
    },
    {
      champ: `Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)`,
      details: true,
    },
  ],
  'potentiel solaire': [
    {
      champ: `Ensoleillement de référence (kWh/m²/an)`,
      details: true,
    },
    {
      champ: `Productible annuel (MWh/an)`,
      details: true,
    },
    {
      champ: `Facteur de charges (kWh/kWc)`,
      details: true,
    },
  ],
  implantation: [
    {
      champ: `Surface projetée au sol de l’ensemble des Capteurs solaires (ha)`,
      details: true,
    },
    {
      champ: `Surface du Terrain d’implantation (ha)`,
      details: true,
    },
    {
      champ: `Terrain d’implantation est dégradé au sens du cas 3 du 2.6`,
      details: true,
    },
    {
      champ: `Terrain d’implantation bénéficie de la dérogation sur le c) du Cas 2 du 2.6`,
      details: true,
    },
    {
      champ: `Détention de l’Autorisation d’Urbanisme`,
      details: true,
    },
    {
      champ: `Type d'utorisation d'Urbanisme (pièce n°3)`,
      details: true,
    },
    {
      champ: `Type de terrain d'implantation \n(pièce n°3)`,
      details: true,
    },
    {
      champ: `Types Cas 3 \n(pièce n°3)`,
      details: true,
    },
    {
      champ: `Type d'AU \n(pièce n°4)`,
      details: true,
    },
    {
      champ: `Codes cas 1\n(AO sol)`,
      details: true,
    },
    {
      champ: `Codes cas 2\n(AO sol)`,
      details: true,
    },
    {
      champ: `Codes cas 3\n(AO sol)`,
      details: true,
    },
  ],
  prix: [
    {
      champ: `Prix Majoré`,
      details: true,
    },
    {
      champ: 'prixReference',
      intitulé:
        'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
    },
    {
      champ: `Prix de référence (€/MWh)`,
      details: true,
    },
  ],
  'références candidature': [
    {
      champ: `date\n(candidature)`,
      details: true,
    },
    {
      champ: `heure\n(candidature)`,
      details: true,
    },
    {
      champ: `Reference Pli\n(candidature)`,
      details: true,
    },
  ],
  instruction: [
    {
      champ: `Condition d'admissibilité ?\n(AO éolien)`,
      details: true,
    },
    {
      champ: `Respect de toutes les conditions d'admissibilité ?`,
      details: true,
    },
    { champ: `Suspicion de doublon ?`, details: true },
    { champ: `Oui projet`, details: true },
    {
      champ: `Suspicion de 500m inter-famille ?`,
      details: true,
    },
    { champ: `Avis admissibilité`, details: true },
    {
      champ: `Dépôt 1ère périodes précédentes ?`,
      details: true,
    },
    { champ: `Comm 1 \n(pièce n°1)`, details: true },
    { champ: `Comm 2 \n(pièce n°1)`, details: true },
    { champ: `Avis \n(pièce n°1)`, details: true },
    { champ: `Comm 1 \n(pièce n°2)`, details: true },
    { champ: `Comm 2 \n(pièce n°2)`, details: true },
    { champ: `Avis \n(pièce n°2)`, details: true },
    {
      champ: `Période visée par certificat d'éligibilité du terrain \n(pièce n°3)'`,
      details: true,
    },
    { champ: `Comm 1 \n(pièce n°3)`, details: true },
    { champ: `Comm 2\n(pièce n°3)`, details: true },
    { champ: `Avis \n(pièce n°3)`, details: true },
    {
      champ: `Comm 1\n(pièce n°4 AO innovation)`,
      details: true,
    },
    {
      champ: `Comm 2\n(pièce n°4 AO innovation)`,
      details: true,
    },
    {
      champ: `Avis\n(pièce n°4 AO innovation)`,
      details: true,
    },
    {
      champ: `Comm 1\n(pièce n°5 AO innovation)`,
      details: true,
    },
    {
      champ: `Comm 2\n(pièce n°5 AO innovation)`,
      details: true,
    },
    {
      champ: `Avis\n(pièce n°5 AO innovation)`,
      details: true,
    },
    { champ: `Date \n(pièce n°4)`, details: true },
    { champ: `Comm 2 \n(pièce n°4)`, details: true },
    { champ: `Avis \n(pièce n°4)`, details: true },
    { champ: `Comm 1 \n(pièce n°6)`, details: true },
    { champ: `Comm 2 \n(pièce n°6)`, details: true },
    { champ: `Avis \n(pièce n°6)`, details: true },
    { champ: `Oui/non ? \n(pièce n°7)`, details: true },
    { champ: `Comm 1 \n(pièce n°7)`, details: true },
    { champ: `Comm 2 \n(pièce n°7)`, details: true },
    { champ: `Avis \n(pièce n°7)`, details: true },
    {
      champ: `Comm 1 \n(Délégation de signature)`,
      details: true,
    },
    {
      champ: `Comm 2 \n(Délégation de signature)`,
      details: true,
    },
    {
      champ: `Avis \n(Délégation de signature)`,
      details: true,
    },
    { champ: `Commentaire final`, details: true },
    { champ: `Avis final`, details: true },
    { champ: `Avis final CRE + ADEME`, details: true },
    { champ: `Nom projet (doublon)`, details: true },
    { champ: `CP (doublon)`, details: true },
    { champ: `Commune (doublon)`, details: true },
    { champ: `Commentaires`, details: true },
    { champ: `Puissance cumulée`, details: true },
  ],
  'résultat instruction sensible': [
    { champ: 'motifsElimination', intitulé: "Motif d'élimination" },
  ],
  'note innovation': [
    {
      champ: `Note degré d’innovation (/20pt)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Commentaire final sur note degré d’innovation\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Nom de l'innovation (ADEME)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Type de l'innovation (ADEME)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Note synergie avec l'usage agricole (/10pt)\n(AO Innovation)`,
      details: true,
    },
    {
      champ: `Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)`,
      details: true,
    },
    {
      champ: `Note positionnement sur le marché (/10pt)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Commentaire final sur note positionnement sur le marché \n(AO innovation)`,
      details: true,
    },
    {
      champ: `Note qualité technique (/5pt)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Commentaire final sur note qualité technique\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)`,
      details: true,
    },
    {
      champ: `Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)`,
      details: true,
    },
  ],
  notes: [
    { champ: `Note prix`, details: true },
    { champ: `Note carbone`, details: true },
    { champ: `Note environnementale`, details: true },
    {
      champ: `Note innovation\n(AO innovation)`,
      details: true,
    },
    { champ: 'note', intitulé: 'Note totale' },
  ],
  'modifications avant import': [
    { champ: `Type de modification 1`, details: true },
    { champ: `Date de modification 1`, details: true },
    { champ: `Colonne concernée 1`, details: true },
    { champ: `Ancienne valeur 1`, details: true },
    { champ: `Type de modification 2`, details: true },
    { champ: `Date de modification 2`, details: true },
    { champ: `Colonne concernée 2`, details: true },
    { champ: `Ancienne valeur 2`, details: true },
    { champ: `Type de modification 3`, details: true },
    { champ: `Date de modification 3`, details: true },
    { champ: `Colonne concernée 3`, details: true },
    { champ: `Ancienne valeur 3`, details: true },
    { champ: `Type de modification 4`, details: true },
    { champ: `Date de modification 4`, details: true },
    { champ: `Colonne concernée 4`, details: true },
    { champ: `Ancienne valeur 4`, details: true },
    { champ: `Type de modification 5`, details: true },
    { champ: `Date de modification 5`, details: true },
    { champ: `Colonne concernée 5`, details: true },
    { champ: `Ancienne valeur 5`, details: true },
  ],
  'garanties financières': [
    {
      champ: literal(`TO_CHAR("garantiesFinancières"."dateEnvoi", 'DD/MM/YYYY')`),
      intitulé: `Date de soumission sur Potentiel des garanties financières`,
    },
    {
      champ: literal(`TO_CHAR("garantiesFinancières"."dateConstitution", 'DD/MM/YYYY')`),
      intitulé: `Date déclarée par le porteur de dépôt des garanties financières`,
    },
  ],
}

const permissionsDGEC = [
  'identification projet',
  'coordonnées candidat',
  'financement citoyen',
  'contenu local',
  'localisation projet',
  'coordonnées géodésiques',
  "coût d'investissement",
  'données autoconsommation',
  'données de raccordement',
  'données fournisseurs',
  'évaluation carbone',
  'potentiel solaire',
  'implantation',
  'prix',
  'références candidature',
  'instruction',
  'résultat instruction sensible',
  'note innovation',
  'notes',
  'modifications avant import',
  'garanties financières',
] as const

const rolesPourCatégoriesPermission = ['admin', 'dgec-validateur'] as const
export type RolesPourCatégoriesPermission = typeof rolesPourCatégoriesPermission[number]
// à terme 'Roles' sera remplace par le type existant UserRoles

export const catégoriesPermissionsParRôle: Record<
  RolesPourCatégoriesPermission,
  Readonly<Array<Catégories>>
> = {
  admin: permissionsDGEC,
  'dgec-validateur': permissionsDGEC,
}
