export const donnéesProjetParCatégorie: Record<string, string[]> = {
  'identification projet': [
    'numeroCRE',
    'appelOffreId',
    'periodeId',
    'familleId',
    'nomProjet',
    'nomCandidat',
    'actionnaire',
    'territoireProjet',
    'nomCandidat',
    'Numéro SIREN ou SIRET*',
    'Code NACE',
    'Nature du candidat',
    'Type entreprise',
    'technologie',
    'Typologie de projet',
    'puissance',
    'Puissance installée (MWc)',
    'engagementFournitureDePuissanceAlaPointe',
    'Diamètre du rotor (m)\n(AO éolien)',
    'Hauteur bout de pâle (m)\n(AO éolien)',
    "Nb d'aérogénérateurs\n(AO éolien)",
    'notifiedOn',
    'cahierDesChargesActuel',
    'classe',
  ],
  'coordonnées candidat': [
    "Région d'implantation",
    'Adresse',
    'nomRepresentantLegal',
    'Titre du représentant légal',
    'Nom et prénom du signataire du formulaire',
    'Nom et prénom du contact',
    'Titre du contact',
    'Adresse postale du contact',
    'email',
    'Téléphone',
  ],
  'financement citoyen': [
    'isInvestissementParticipatif',
    'isFinancementParticipatif',
    '€/MWh bonus participatif',
    'actionnariat',
  ],
  'contenu local': [
    'Contenu local français (%)\n(Cellules)',
    'Contenu local européen (%)\n(Cellules)',
    'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
    'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
    'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
    'Coût total du lot (M€)\n(Polysilicium)',
    'Contenu local français (%)\n(Polysilicium)',
    'Contenu local européen (%)\n(Polysilicium)',
    'Coût total du lot (M€)\n(Postes de conversion)',
    'Contenu local français (%)\n(Postes de conversion)',
    'Contenu local européen (%)\n(Postes de conversion)',
    'Coût total du lot (M€)\n(Structure)',
    'Contenu local français (%)\n(Structure)',
    'Contenu local européen (%)\n(Structure)',
    'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
    'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
    'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
    'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
    'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
    'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
    'Coût total du lot (M€)\n(Autres technologies)',
    'Contenu local français (%)\n(Autres technologies)',
    'Contenu local européen (%)\n(Autres technologies)',
    'Coût total du lot (M€)\n(Installation et mise en service )',
    'Contenu local français (%)\n(Installation et mise en service)',
    'Contenu local européen (%)\n(Installation et mise en service)',
    'Commentaires contenu local\n(Installation et mise en service)',
    'Coût total du lot (M€)\n(raccordement)',
    'Contenu local français (%)\n(raccordement)',
    'Contenu local européen (%)\n(raccordement)',
    'Contenu local TOTAL :\ncoût total (M€)',
    'Contenu local TOTAL français (%)',
    'Contenu local TOTAL européen (%)',
    'Contenu local TOTAL :\nCommentaires',
    'Coût total du lot (M€)\n(Modules ou films)',
    'Contenu local français (%)\n(Modules ou films)',
    'Contenu local européen (%)\n(Modules ou films)',
    'Coût total du lot (M€)\n(Cellules)',
    'Coût total du lot (M€)\n(Développement)',
    'Contenu local français (%)\n(Développement)',
    'Contenu local européen (%)\n(Développement)',
    'Contenu local développement :\nCommentaires',
    'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)',
    'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)',
    'Contenu local Fabrication de composants et assemblage :`nPourcentage de contenu local européen (%)',
    'Contenu local Fabrication de composants et assemblage :\nCommentaires',
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
  prix: [
    'Prix Majoré',
    'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
    'Prix de référence (€/MWh)',
  ],
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
  'résultat instruction sensible': ["Motif d'élimination"],
  'note innovation': [
    'Note degré d’innovation (/20pt)\n(AO innovation)',
    'Commentaire final sur note degré d’innovation\n(AO innovation)',
    "Nom de l'innovation (ADEME)\n(AO innovation)",
    "Type de l'innovation (ADEME)\n(AO innovation)",
    "Note synergie avec l'usage agricole (/10pt)\n(AO Innovation)",
    "Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)",
    'Note positionnement sur le marché (/10pt)\n(AO innovation)',
    'Commentaire final sur note positionnement sur le marché \n(AO innovation)',
    'Note qualité technique (/5pt)\n(AO innovation)',
    'Commentaire final sur note qualité technique\n(AO innovation)',
    'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)',
    'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)',
    'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)',
    'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)',
  ],
  notes: [
    'Note prix',
    'Note carbone',
    'Note environnementale',
    'Note innovation\n(AO innovation)',
    'Note totale',
  ],
  'modifications avant import': [
    'Type de modification 1',
    'Date de modification 1',
    'Colonne concernée 1',
    'Ancienne valeur 1',
    'Type de modification 2',
    'Date de modification 2',
    'Colonne concernée 2',
    'Ancienne valeur 2',
    'Type de modification 3',
    'Date de modification 3',
    'Colonne concernée 3',
    'Ancienne valeur 3',
    'Type de modification 4',
    'Date de modification 4',
    'Colonne concernée 4',
    'Ancienne valeur 4',
    'Type de modification 5',
    'Date de modification 5',
    'Colonne concernée 5',
    'Ancienne valeur 5',
  ],
  'garanties financières': ['dateEnvoi', 'dateConstitution'],
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
]

const rolesPourCatégoriesPermission = ['admin', 'dgec-validateur'] as const
export type RolesPourCatégoriesPermission = typeof rolesPourCatégoriesPermission[number]
// à terme 'Roles' sera remplace par le type existant UserRoles

export const catégoriesPermissionsParRôle: Record<RolesPourCatégoriesPermission, string[]> = {
  admin: permissionsDGEC,
  'dgec-validateur': permissionsDGEC,
}
