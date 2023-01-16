import { json, literal } from 'sequelize'
import { Json, Literal } from 'sequelize/types/utils'

export type Colonne = {
  champ: string | Json | Literal
  intitulé: string
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
    { champ: json(`details->>'Numéro SIREN ou SIRET*'`), intitulé: 'Numéro SIREN ou SIRET' },
    { champ: json(`details->>'Code NACE'`), intitulé: 'Code NACE' },
    { champ: json(`details->>'Nature du candidat'`), intitulé: 'Nature du candidat' },
    { champ: json(`details->>'Type entreprise'`), intitulé: 'Type entreprise' },
    { champ: 'technologie', intitulé: 'Technologie\n(dispositif de production)' },
    { champ: json(`details->>'Typologie de projet'`), intitulé: 'Typologie de projet' },
    {
      champ: 'puissance',
      intitulé: 'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
    },
    { champ: json(`details->>'Puissance installée (MWc)'`), intitulé: 'Puissance installée (MWc)' },
    {
      champ: 'engagementFournitureDePuissanceAlaPointe',
      intitulé: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
    },
    {
      champ: json(`details->>'Diamètre du rotor (m)\n(AO éolien)'`),
      intitulé: 'Diamètre du rotor (m)\n(AO éolien)',
    },
    {
      champ: json(`details->>'Hauteur bout de pâle (m)\n(AO éolien)'`),
      intitulé: 'Hauteur bout de pâle (m)\n(AO éolien)',
    },
    {
      champ: json(`details->>'Nb d''aérogénérateurs\n(AO éolien)'`),
      intitulé: "Nb d'aérogénérateurs\n(AO éolien)",
    },
    {
      champ: literal(`TO_CHAR(TO_TIMESTAMP("notifiedOn" / 1000), 'DD/MM/YYYY')`),
      intitulé: 'Notification',
    },
    { champ: 'cahierDesChargesActuel', intitulé: 'cahier des charges choisi' },
    { champ: 'classe', intitulé: 'Classé ?' },
  ],
  'coordonnées candidat': [
    { champ: json(`details->>'Région d''implantation'`), intitulé: `Région d'implantation` },
    { champ: json(`details->>'Adresse'`), intitulé: 'Adresse' },
    { champ: 'nomRepresentantLegal', intitulé: 'Nom et prénom du représentant légal' },
    {
      champ: json(`details->>'Titre du représentant légal'`),
      intitulé: 'Titre du représentant légal',
    },
    {
      champ: json(`details->>'Nom et prénom du signataire du formulaire'`),
      intitulé: 'Nom et prénom du signataire du formulaire',
    },
    { champ: json(`details->>'Nom et prénom du contact'`), intitulé: 'Nom et prénom du contact' },
    { champ: json(`details->>'Titre du contact'`), intitulé: 'Titre du contact' },
    {
      champ: json(`details->>'Adresse postale du contact'`),
      intitulé: 'Adresse postale du contact',
    },
    { champ: 'email', intitulé: 'Adresse électronique du contact' },
    { champ: json(`details->>'Téléphone'`), intitulé: 'Téléphone' },
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
    { champ: json(`details->>'€/MWh bonus participatif'`), intitulé: '€/MWh bonus participatif' },
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
      champ: json(`details->>'Contenu local français (%)\n(Cellules)'`),
      intitulé: 'Contenu local français (%)\n(Cellules)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Cellules)'`),
      intitulé: 'Contenu local européen (%)\n(Cellules)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))'`),
      intitulé: 'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Plaquettes de silicium (wafers))'`),
      intitulé: 'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Plaquettes de silicium (wafers))'`),
      intitulé: 'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Polysilicium)'`),
      intitulé: 'Coût total du lot (M€)\n(Polysilicium)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Polysilicium)'`),
      intitulé: 'Contenu local français (%)\n(Polysilicium)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Polysilicium)'`),
      intitulé: 'Contenu local européen (%)\n(Polysilicium)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Postes de conversion)'`),
      intitulé: 'Coût total du lot (M€)\n(Postes de conversion)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Postes de conversion)'`),
      intitulé: 'Contenu local français (%)\n(Postes de conversion)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Postes de conversion)'`),
      intitulé: 'Contenu local européen (%)\n(Postes de conversion)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Structure)'`),
      intitulé: 'Coût total du lot (M€)\n(Structure)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Structure)'`),
      intitulé: 'Contenu local français (%)\n(Structure)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Structure)'`),
      intitulé: 'Contenu local européen (%)\n(Structure)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)'`),
      intitulé: 'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
    },
    {
      champ: json(
        `details->>'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)'`
      ),
      intitulé: 'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
    },
    {
      champ: json(
        `details->>'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)'`
      ),
      intitulé: 'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
    },
    {
      champ: json(
        `details->>'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)'`
      ),
      intitulé: 'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
    },
    {
      champ: json(
        `details->>'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)'`
      ),
      intitulé: 'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
    },
    {
      champ: json(
        `details->>'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)'`
      ),
      intitulé: 'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Autres technologies)'`),
      intitulé: 'Coût total du lot (M€)\n(Autres technologies)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Autres technologies)'`),
      intitulé: 'Contenu local français (%)\n(Autres technologies)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Autres technologies)'`),
      intitulé: 'Contenu local européen (%)\n(Autres technologies)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Installation et mise en service )'`),
      intitulé: 'Coût total du lot (M€)\n(Installation et mise en service )',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Installation et mise en service)'`),
      intitulé: 'Contenu local français (%)\n(Installation et mise en service)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Installation et mise en service)'`),
      intitulé: 'Contenu local européen (%)\n(Installation et mise en service)',
    },
    {
      champ: json(`details->>'Commentaires contenu local\n(Installation et mise en service)'`),
      intitulé: 'Commentaires contenu local\n(Installation et mise en service)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(raccordement)'`),
      intitulé: 'Coût total du lot (M€)\n(raccordement)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(raccordement)'`),
      intitulé: 'Contenu local français (%)\n(raccordement)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(raccordement)'`),
      intitulé: 'Contenu local européen (%)\n(raccordement)',
    },
    {
      champ: json(`details->>'Contenu local TOTAL :\ncoût total (M€)'`),
      intitulé: 'Contenu local TOTAL :\ncoût total (M€)',
    },
    {
      champ: json(`details->>'Contenu local TOTAL français (%)'`),
      intitulé: 'Contenu local TOTAL français (%)',
    },
    {
      champ: json(`details->>'Contenu local TOTAL européen (%)'`),
      intitulé: 'Contenu local TOTAL européen (%)',
    },
    {
      champ: json(`details->>'Contenu local TOTAL :\nCommentaires'`),
      intitulé: 'Contenu local TOTAL :\nCommentaires',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Modules ou films)'`),
      intitulé: 'Coût total du lot (M€)\n(Modules ou films)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Modules ou films)'`),
      intitulé: 'Contenu local français (%)\n(Modules ou films)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Modules ou films)'`),
      intitulé: 'Contenu local européen (%)\n(Modules ou films)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Cellules)'`),
      intitulé: 'Coût total du lot (M€)\n(Cellules)',
    },
    {
      champ: json(`details->>'Coût total du lot (M€)\n(Développement)'`),
      intitulé: 'Coût total du lot (M€)\n(Développement)',
    },
    {
      champ: json(`details->>'Contenu local français (%)\n(Développement)'`),
      intitulé: 'Contenu local français (%)\n(Développement)',
    },
    {
      champ: json(`details->>'Contenu local européen (%)\n(Développement)'`),
      intitulé: 'Contenu local européen (%)\n(Développement)',
    },
    {
      champ: json(`details->>'Contenu local développement :\nCommentaires'`),
      intitulé: 'Contenu local développement :\nCommentaires',
    },
    {
      champ: json(
        `details->>'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)'`
      ),
      intitulé: 'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)',
    },
    {
      champ: json(
        `details->>'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)'`
      ),
      intitulé:
        'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)',
    },
    {
      champ: json(
        `details->>'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)'`
      ),
      intitulé:
        'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)',
    },
    {
      champ: json(
        `details->>'Contenu local Fabrication de composants et assemblage :\nCommentaires'`
      ),
      intitulé: 'Contenu local Fabrication de composants et assemblage :\nCommentaires',
    },
  ],
  'localisation projet': [
    'adresseProjet',
    'codePostalProjet',
    'communeProjet',
    'Département',
    'Région',
  ],
  'coordonnées géodésiques': [
    'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)',
    'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)',
    'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)',
    'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)',
    'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(degrés)',
    'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(minutes)',
    'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(secondes)',
    'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(cardinal)',
  ],
  "coût d'investissement": [
    'Raccordement € / kWc',
    'Investissement total (k€)',
    'dont quantité de fonds propres (k€)',
    "dont quantité d'endettement  (k€)",
    "dont quantité de subventions à l'investissement  (k€)",
    "dont quantité d'autres avantages financiers  (k€)",
    'Location (€/an/MWc)',
    'CAPEX Moyen\n(k€ / MWc)',
  ],
  'données autoconsommation': [
    "Taux d'autoconsommation \n(AO autoconsommation)",
    'Type de consommateur associé\n(AO autoconsommation)',
    'Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)',
    'Taux occupation toiture\n(AO autoconsommation)',
  ],
  'données de raccordement': [
    'Référence du dossier de raccordement*',
    'Date de mise en service du raccordement attendue (mm/aaaa)',
    'Capacité du raccordement (kW)',
    'Montant estimé du raccordement (k€)',
    'dateFileAttente',
    'dateMiseEnService',
    'numeroGestionnaire',
  ],
  'données fournisseurs': [
    'Technologie (Modules ou films)',
    'Référence commerciale \n(Modules ou films)',
    'Nom du fabricant \n(Modules ou films)',
    'Lieu(x) de fabrication \n(Modules ou films)',
    'Puissance crête (Wc) \n(Modules ou films)',
    'Rendement nominal \n(Modules ou films)',
    'Nom du fabricant (Cellules)',
    'Lieu(x) de fabrication (Cellules)',
    'Nom du fabricant \n(Polysilicium)',
    'Lieu(x) de fabrication \n(Polysilicium)',
    'Nom du fabricant (Structure)',
    'Lieu(x) de fabrication \n(Structure)',
    'Technologie \n(Dispositifs de stockage de l’énergie *)',
    'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
    'Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)',
    'Technologie \n(Dispositifs de suivi de la course du soleil *)',
    'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
    'Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *)',
    'Référence commerciale \n(Autres technologies)',
    'Nom du fabricant \n(Autres technologies)',
    'Lieu(x) de fabrication \n(Autres technologies)',
    'Coût des modules €/Wc',
    'Nom du fabricant \n(Plaquettes de silicium (wafers))',
    'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))',
    'Nom du fabricant \n(Postes de conversion)',
    'Lieu(x) de fabrication \n(Postes de conversion)',
  ],
  'évaluation carbone': [
    'evaluationCarbone',
    'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)',
  ],
  'potentiel solaire': [
    'Ensoleillement de référence (kWh/m²/an)',
    'Productible annuel (MWh/an)',
    'Facteur de charges (kWh/kWc)',
  ],
  implantation: [
    'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
    'Surface du Terrain d’implantation (ha)',
    'Terrain d’implantation est dégradé au sens du cas 3 du 2.6',
    'Terrain d’implantation bénéficie de la dérogation sur le c) du Cas 2 du 2.6',
    'Détention de l’Autorisation d’Urbanisme',
    "Type d'utorisation d'Urbanisme (pièce n°3)",
    "Type de terrain d'implantation \n(pièce n°3)",
    'Types Cas 3 \n(pièce n°3)',
    "Type d'AU \n(pièce n°4)",
    'Codes cas 1\n(AO sol)',
    'Codes cas 2\n(AO sol)',
    'Codes cas 3\n(AO sol)',
  ],
  prix: ['Prix Majoré', 'prixReference', 'Prix de référence (€/MWh)'],
  'références candidature': [
    'date\n(candidature)',
    'heure\n(candidature)',
    'Reference Pli\n(candidature)',
  ],
  instruction: [
    "Condition d'admissibilité ?\n(AO éolien)",
    "Respect de toutes les conditions d'admissibilité ?",
    'Suspicion de doublon ?',
    'Oui projet',
    'Suspicion de 500m inter-famille ?',
    'Avis admissibilité',
    'Dépôt 1ère périodes précédentes ?',
    'Comm 1 \n(pièce n°1)',
    'Comm 2 \n(pièce n°1)',
    'Avis \n(pièce n°1)',
    'Comm 1 \n(pièce n°2)',
    'Comm 2 \n(pièce n°2)',
    'Avis \n(pièce n°2)',
    "Période visée par certificat d'éligibilité du terrain \n(pièce n°3)",
    'Comm 1 \n(pièce n°3)',
    'Comm 2\n(pièce n°3)',
    'Avis \n(pièce n°3)',
    'Comm 1\n(pièce n°4 AO innovation)',
    'Comm 2\n(pièce n°4 AO innovation)',
    'Avis\n(pièce n°4 AO innovation)',
    'Comm 1\n(pièce n°5 AO innovation)',
    'Comm 2\n(pièce n°5 AO innovation)',
    'Avis\n(pièce n°5 AO innovation)',
    'Date \n(pièce n°4)',
    'Comm 2 \n(pièce n°4)',
    'Avis \n(pièce n°4)',
    'Comm 1 \n(pièce n°6)',
    'Comm 2 \n(pièce n°6)',
    'Avis \n(pièce n°6)',
    'Oui/non ? \n(pièce n°7)',
    'Comm 1 \n(pièce n°7)',
    'Comm 2 \n(pièce n°7)',
    'Avis \n(pièce n°7)',
    'Comm 1 \n(Délégation de signature)',
    'Comm 2 \n(Délégation de signature)',
    'Avis \n(Délégation de signature)',
    'Commentaire final',
    'Avis final',
    'Avis final CRE + ADEME',
    'Nom projet (doublon)',
    'CP (doublon)',
    'Commune (doublon)',
    'Commentaires',
    'Puissance cumulée',
  ],
  'résultat instruction sensible': ['motifsElimination'],
  'note innovation': [
    {
      champ: json(`details->>'Note degré d’innovation (/20pt)\n(AO innovation)'`),
      intitulé: 'Note degré d’innovation (/20pt)\n(AO innovation)',
    },
    {
      champ: json(`details->>'Commentaire final sur note degré d’innovation\n(AO innovation)'`),
      intitulé: 'Commentaire final sur note degré d’innovation\n(AO innovation)',
    },
    {
      champ: json(`details->>'Nom de l''innovation (ADEME)\n(AO innovation)'`),
      intitulé: "Nom de l'innovation (ADEME)\n(AO innovation)",
    },
    {
      champ: json(`details->>'Type de l''innovation (ADEME)\n(AO innovation)'`),
      intitulé: "Type de l'innovation (ADEME)\n(AO innovation)",
    },
    {
      champ: json(`details->>'Note synergie avec l''usage agricole (/10pt)\n(AO Innovation)'`),
      intitulé: "Note synergie avec l'usage agricole (/10pt)\n(AO Innovation)",
    },
    {
      champ: json(
        `details->>'Commentaire final sur note synergie avec l''usage agricole \n(AO Innovation)'`
      ),
      intitulé: "Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)",
    },
    {
      champ: json(`details->>'Note positionnement sur le marché (/10pt)\n(AO innovation)'`),
      intitulé: 'Note positionnement sur le marché (/10pt)\n(AO innovation)',
    },
    {
      champ: json(
        `details->>'Commentaire final sur note positionnement sur le marché \n(AO innovation)'`
      ),
      intitulé: 'Commentaire final sur note positionnement sur le marché \n(AO innovation)',
    },
    {
      champ: json(`details->>'Note qualité technique (/5pt)\n(AO innovation)'`),
      intitulé: 'Note qualité technique (/5pt)\n(AO innovation)',
    },
    {
      champ: json(`details->>'Commentaire final sur note qualité technique\n(AO innovation)'`),
      intitulé: 'Commentaire final sur note qualité technique\n(AO innovation)',
    },
    {
      champ: json(
        `details->>'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)'`
      ),
      intitulé:
        'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)',
    },
    {
      champ: json(
        `details->>'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)'`
      ),
      intitulé:
        'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)',
    },
    {
      champ: json(`details->>'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'`),
      intitulé: 'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)',
    },
    {
      champ: json(
        `details->>'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)'`
      ),
      intitulé: 'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)',
    },
  ],
  notes: [
    { champ: json(`details->>'Note prix'`), intitulé: 'Note prix' },
    { champ: json(`details->>'Note carbone'`), intitulé: 'Note carbone' },
    { champ: json(`details->>'Note environnementale'`), intitulé: 'Note environnementale' },
    {
      champ: json(`details->>'Note innovation\n(AO innovation)'`),
      intitulé: 'Note innovation\n(AO innovation)',
    },
    { champ: 'note', intitulé: 'Note totale' },
  ],
  'modifications avant import': [
    { champ: json(`details->>'Type de modification 1'`), intitulé: 'Type de modification 1' },
    { champ: json(`details->>'Date de modification 1'`), intitulé: 'Date de modification 1' },
    { champ: json(`details->>'Colonne concernée 1'`), intitulé: 'Colonne concernée 1' },
    { champ: json(`details->>'Ancienne valeur 1'`), intitulé: 'Ancienne valeur 1' },
    { champ: json(`details->>'Type de modification 2'`), intitulé: 'Type de modification 2' },
    { champ: json(`details->>'Date de modification 2'`), intitulé: 'Date de modification 2' },
    { champ: json(`details->>'Colonne concernée 2'`), intitulé: 'Colonne concernée 2' },
    { champ: json(`details->>'Ancienne valeur 2'`), intitulé: 'Ancienne valeur 2' },
    { champ: json(`details->>'Type de modification 3'`), intitulé: 'Type de modification 3' },
    { champ: json(`details->>'Date de modification 3'`), intitulé: 'Date de modification 3' },
    { champ: json(`details->>'Colonne concernée 3'`), intitulé: 'Colonne concernée 3' },
    { champ: json(`details->>'Ancienne valeur 3'`), intitulé: 'Ancienne valeur 3' },
    { champ: json(`details->>'Type de modification 4'`), intitulé: 'Type de modification 4' },
    { champ: json(`details->>'Date de modification 4'`), intitulé: 'Date de modification 4' },
    { champ: json(`details->>'Colonne concernée 4'`), intitulé: 'Colonne concernée 4' },
    { champ: json(`details->>'Ancienne valeur 4'`), intitulé: 'Ancienne valeur 4' },
    { champ: json(`details->>'Type de modification 5'`), intitulé: 'Type de modification 5' },
    { champ: json(`details->>'Date de modification 5'`), intitulé: 'Date de modification 5' },
    { champ: json(`details->>'Colonne concernée 5'`), intitulé: 'Colonne concernée 5' },
    { champ: json(`details->>'Ancienne valeur 5'`), intitulé: 'Ancienne valeur 5' },
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
  // 'références candidature',
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
