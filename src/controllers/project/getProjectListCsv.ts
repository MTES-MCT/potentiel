import { Pagination } from '../../types'
import { makePagination } from '../../helpers/paginate'
import routes from '@routes'
import { parseAsync } from 'json2csv'
import { logger } from '@core/utils'
import { v1Router } from '../v1Router'
import { listProjects } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { promises as fsPromises } from 'fs'
import { formatField, writeCsvOnDisk } from '../../helpers/csv'
import { vérifierPermissionUtilisateur } from '../helpers'
import { PermissionListerProjets } from '@modules/project'

const orderedFields = [
  { dataField: 'numeroCRE', visibility: ['*'] },
  { dataField: 'appelOffreId', visibility: ['*'] },
  { dataField: 'periodeId', visibility: ['*'] },
  { dataField: 'familleId', visibility: ['*'] },
  {
    dataField: 'Candidat',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Société mère',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'nomProjet', visibility: ['*'] },
  {
    dataField: 'Territoire\n(AO ZNI)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'puissance', visibility: ['*'] },
  {
    dataField: 'prixReference',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'acheteur-obligé', 'ademe'],
  },
  { dataField: "Taux d'autoconsommation \n(AO autoconsommation)", visibility: ['*'] },
  { dataField: 'evaluationCarbone', visibility: ['*'] },
  { dataField: 'Note prix', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé'] },
  { dataField: 'Note carbone', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé'] },
  {
    dataField: 'Note environnementale',
    visibility: ['admin', 'dgec-validateur', 'acheteur-obligé'],
  },
  {
    dataField: 'Note innovation\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'ademe'],
  },
  { dataField: 'note', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'ademe'] },
  {
    dataField: 'nomCandidat',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'Nature du candidat', visibility: ['*'] },
  {
    dataField: 'Numéro SIREN ou SIRET*',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'Code NACE', visibility: ['admin', 'dreal', 'porteur-projet', 'acheteur-obligé'] },
  { dataField: 'Type entreprise', visibility: ['*'] },
  {
    dataField: "Région d'implantation",
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Adresse',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'nomRepresentantLegal',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Titre du représentant légal',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Nom et prénom du signataire du formulaire',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Nom et prénom du contact',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Titre du contact',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Adresse postale du contact',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'email',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Téléphone',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'Nom du projet', visibility: ['*'] },
  { dataField: "Nb d'aérogénérateurs\n(AO éolien)", visibility: ['*'] },
  { dataField: 'Famille de candidature', visibility: ['*'] },
  { dataField: 'Puissance installée (MWc)', visibility: ['*'] },
  { dataField: 'Type de consommateur associé\n(AO autoconsommation)', visibility: ['*'] },
  {
    dataField: 'Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)',
    visibility: ['*'],
  },
  { dataField: 'Typologie de projet', visibility: ['*'] },
  { dataField: 'adresseProjet', visibility: ['*'] },
  { dataField: 'codePostalProjet', visibility: ['*'] },
  { dataField: 'communeProjet', visibility: ['*'] },
  { dataField: 'departementProjet', visibility: ['*'] },
  { dataField: 'regionProjet', visibility: ['*'] },
  {
    dataField: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(degrés)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(minutes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(secondes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(cardinal)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'Taux occupation toiture\n(AO autoconsommation)', visibility: ['*'] },
  {
    dataField: 'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
    visibility: ['*'],
  },
  { dataField: 'Surface du Terrain d’implantation (ha)', visibility: ['*'] },
  {
    dataField: 'Référence du dossier de raccordement*',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Dépôt 1ère périodes précédentes ?',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Prix de référence (€/MWh)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'acheteur-obligé', 'ademe'],
  },
  { dataField: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)', visibility: ['*'] },
  {
    dataField: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'Terrain d’implantation est dégradé au sens du cas 3 du 2.6', visibility: ['*'] },
  {
    dataField: 'Terrain d’implantation bénéficie de la dérogation sur le c) du Cas 2 du 2.6',
    visibility: ['*'],
  },
  { dataField: 'Détention de l’Autorisation d’Urbanisme', visibility: ['*'] },
  {
    dataField: 'Coût total du lot (M€)\n(Développement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Développement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Développement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local développement :\nCommentaires',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField:
      'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField:
      'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local Fabrication de composants et assemblage :\nCommentaires',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Technologie (Modules ou films)', visibility: ['*'] },
  { dataField: 'Référence commerciale \n(Modules ou films)', visibility: ['*'] },
  { dataField: 'Nom du fabricant \n(Modules ou films)', visibility: ['*'] },
  { dataField: 'Lieu(x) de fabrication \n(Modules ou films)', visibility: ['*'] },
  { dataField: 'Puissance crête (Wc) \n(Modules ou films)', visibility: ['*'] },
  { dataField: 'Rendement nominal \n(Modules ou films)', visibility: ['*'] },
  {
    dataField: 'Coût des modules €/Wc',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Diamètre du rotor (m)\n(AO éolien)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Hauteur bout de pâle (m)\n(AO éolien)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Modules ou films)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Modules ou films)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Modules ou films)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Nom du fabricant (Cellules)', visibility: ['*'] },
  { dataField: 'Lieu(x) de fabrication (Cellules)', visibility: ['*'] },
  {
    dataField: 'Coût total du lot (M€)\n(Cellules)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Cellules)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Cellules)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Nom du fabricant \n(Plaquettes de silicium (wafers))', visibility: ['*'] },
  { dataField: 'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))', visibility: ['*'] },
  {
    dataField: 'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Nom du fabricant \n(Polysilicium)', visibility: ['*'] },
  { dataField: 'Lieu(x) de fabrication \n(Polysilicium)', visibility: ['*'] },
  {
    dataField: 'Coût total du lot (M€)\n(Polysilicium)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Polysilicium)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Polysilicium)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Nom du fabricant \n(Postes de conversion)', visibility: ['*'] },
  { dataField: 'Lieu(x) de fabrication \n(Postes de conversion)', visibility: ['*'] },
  {
    dataField: 'Coût total du lot (M€)\n(Postes de conversion)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Postes de conversion)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Postes de conversion)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Nom du fabricant \n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Technologie \n(Dispositifs de stockage de l’énergie *)', visibility: ['*'] },
  { dataField: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)', visibility: ['*'] },
  {
    dataField: 'Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)',
    visibility: ['*'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Technologie \n(Dispositifs de suivi de la course du soleil *)', visibility: ['*'] },
  {
    dataField: 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['*'],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['*'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'Référence commerciale \n(Autres technologies)', visibility: ['*'] },
  { dataField: 'Nom du fabricant \n(Autres technologies)', visibility: ['*'] },
  { dataField: 'Lieu(x) de fabrication \n(Autres technologies)', visibility: ['*'] },
  {
    dataField: 'Coût total du lot (M€)\n(Autres technologies)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Autres technologies)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Autres technologies)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Installation et mise en service )',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(Installation et mise en service) ',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Installation et mise en service)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Commentaires contenu local\n(Installation et mise en service)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(raccordement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local français (%)\n(raccordement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local européen (%)\n(raccordement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local TOTAL :\ncoût total (M€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local TOTAL français (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local TOTAL européen (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Contenu local TOTAL :\nCommentaires',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Ensoleillement de référence (kWh/m²/an)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Productible annuel (MWh/an)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Facteur de charges (kWh/kWc)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Date de mise en service du raccordement attendue (mm/aaaa)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet'],
  },
  {
    dataField: 'Capacité du raccordement (kW)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet'],
  },
  {
    dataField: 'Montant estimé du raccordement (k€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet'],
  },
  {
    dataField: 'Raccordement € / kWc',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Investissement total (k€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'dont quantité de fonds propres (k€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: "dont quantité d'endettement  (k€)",
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: "dont quantité de subventions à l'investissement  (k€)",
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: "dont quantité d'autres avantages financiers  (k€)",
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'Location (€/an/MWc)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  {
    dataField: 'CAPEX Moyen\n(k€ / MWc)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe'],
  },
  { dataField: 'date\n(candidature)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'heure\n(candidature)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'Reference Pli\n(candidature)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'Typologie de projet', visibility: ['admin', 'dgec-validateur', 'dreal', 'ademe'] },
  {
    dataField: "Condition d'admissibilité ?\n(AO éolien)",
    visibility: ['admin', 'dgec-validateur'],
  },
  {
    dataField: "Type d'utorisation d'Urbanisme (pièce n°3)",
    visibility: ['admin', 'dgec-validateur', 'dreal'],
  },
  {
    dataField: 'Investissement ou financement participatif ?',
    fn: (row) => row.isInvestissementParticipatif || row.isFinancementParticipatif,
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe'],
  },
  {
    dataField: 'Financement collectif (Oui/Non)',
    fn: (row) => row.actionnariat === 'financement-collectif',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe'],
  },
  {
    dataField: 'Gouvernance partagée (Oui/Non)',
    fn: (row) => row.actionnariat === 'gouvernance-partagee',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe'],
  },
  {
    dataField: '€/MWh bonus participatif',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Note degré d’innovation (/20pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Commentaire final sur note degré d’innovation\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Nom de l'innovation (ADEME)\n(AO innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Type de l'innovation (ADEME)\n(AO innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Note synergie avec l'usage agricole (/10pt)\n(AO Innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Note positionnement sur le marché (/10pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Commentaire final sur note positionnement sur le marché \n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Note qualité technique (/5pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Commentaire final sur note qualité technique\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField:
      'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: 'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Respect de toutes les conditions d'admissibilité ?",
    visibility: ['admin', 'dgec-validateur'],
  },
  { dataField: 'Suspicion de doublon ? ', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Oui projet ', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Suspicion de 500m inter-famille ? ', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis admissibilité', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1 \n(pièce n°1)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2 \n(pièce n°1)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(pièce n°1)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1 \n(pièce n°2)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2 \n(pièce n°2)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(pièce n°2)', visibility: ['admin', 'dgec-validateur'] },
  {
    dataField: "Type de terrain d'implantation \n(pièce n°3)",
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Période visée par certificat d'éligibilité du terrain \n(pièce n°3)",
    visibility: ['admin', 'dgec-validateur'],
  },
  { dataField: 'Comm 1 \n(pièce n°3)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2\n(pièce n°3)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Types Cas 3 \n(pièce n°3)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(pièce n°3)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1\n(pièce n°4 AO innovation)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2\n(pièce n°4 AO innovation)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis\n(pièce n°4 AO innovation)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1\n(pièce n°5 AO innovation)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2\n(pièce n°5 AO innovation)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis\n(pièce n°5 AO innovation)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: "Type d'AU \n(pièce n°4)", visibility: ['admin', 'dgec-validateur', 'ademe'] },
  { dataField: 'Date \n(pièce n°4)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2 \n(pièce n°4)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(pièce n°4)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1 \n(pièce n°6)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2 \n(pièce n°6)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(pièce n°6)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Oui/non ? \n(pièce n°7)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1 \n(pièce n°7)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2 \n(pièce n°7)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(pièce n°7)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 1 \n(Délégation de signature)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Comm 2 \n(Délégation de signature)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis \n(Délégation de signature)', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Commentaire final', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis final', visibility: ['admin', 'dgec-validateur'] },
  { dataField: 'Avis final CRE + ADEME', visibility: ['admin', 'dgec-validateur'] },
  {
    dataField: 'Puissance cumulée',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé'],
  },
  { dataField: 'classe', visibility: ['*'] },
  { dataField: 'Prix Majoré', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé'] },
  { dataField: 'Codes cas\n(AO sol)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'Codes cas 2\n(AO sol)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'Codes cas 3\n(AO sol)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'motifsElimination', visibility: ['*'] },
  { dataField: 'Nom projet (doublon)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'CP (doublon)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'Commune (doublon)', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  {
    dataField: 'Modifications',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Statut',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'notifiedOn',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  { dataField: 'Commentaires', visibility: ['admin', 'dgec-validateur', 'dreal'] },
  { dataField: 'Type de modification 1', visibility: ['*'] },
  { dataField: 'Date de modification 1', visibility: ['*'] },
  { dataField: 'Colonne concernée 1', visibility: ['*'] },
  { dataField: 'Ancienne valeur 1', visibility: ['*'] },
  { dataField: 'Type de modification 2', visibility: ['*'] },
  { dataField: 'Date de modification 2', visibility: ['*'] },
  { dataField: 'Colonne concernée 2', visibility: ['*'] },
  { dataField: 'Ancienne valeur 2', visibility: ['*'] },
  { dataField: 'Type de modification 3', visibility: ['*'] },
  { dataField: 'Date de modification 3', visibility: ['*'] },
  { dataField: 'Colonne concernée 3', visibility: ['*'] },
  { dataField: 'Ancienne valeur 3', visibility: ['*'] },
  { dataField: 'Type de modification 4', visibility: ['*'] },
  { dataField: 'Date de modification 4', visibility: ['*'] },
  { dataField: 'Colonne concernée 4', visibility: ['*'] },
  { dataField: 'Ancienne valeur 4', visibility: ['*'] },
  { dataField: 'Type de modification 5', visibility: ['*'] },
  { dataField: 'Date de modification 5', visibility: ['*'] },
  { dataField: 'Colonne concernée 5', visibility: ['*'] },
  { dataField: 'Ancienne valeur 5', visibility: ['*'] },
  {
    dataField: 'garantiesFinancières.dateConstitution',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'garantiesFinancières.dateEnvoi',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Technologie\n(dispositif de production)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'ademe'],
  },
]

const getProjectListCsv = asyncHandler(async (request, response) => {
  let { appelOffreId, periodeId, familleId, recherche, classement, garantiesFinancieres } =
    request.query as any

  if (!request.user?.role) {
    return response.redirect(routes.LOGIN)
  }

  if (typeof classement === 'undefined') {
    classement = 'classés'
    request.query.classement = 'classés'
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: 1000000,
  }

  const pagination = makePagination(request.query, defaultPagination)

  if (!appelOffreId) {
    // Reset the periodId and familleId if there is no appelOffreId
    periodeId = undefined
    familleId = undefined
  }

  const {
    projects: { items: projects },
  } = await listProjects({
    user: request.user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    garantiesFinancieres,
  })

  try {
    const selectedFields = _selectFieldsForRole(request.user.role)
    const csv = await parseAsync(projects, { fields: selectedFields, delimiter: ';' })
    const csvFilePath = await writeCsvOnDisk(csv, '/tmp')

    // Delete file when the client's download is complete
    response.on('finish', async () => {
      await fsPromises.unlink(csvFilePath)
    })

    return response.type('text/csv').sendFile(csvFilePath)
  } catch (error) {
    logger.error(error)
    return response
      .status(500)
      .send(
        "Un problème est survenu pendant la génération de l'export des projets en format csv. Veuillez contacter un administrateur."
      )
  }
})

function _selectFieldsForRole(userRole: string): { label: string; value: string | Function }[] {
  return orderedFields
    .filter((field) => field.visibility.includes(userRole) || field.visibility.includes('*'))
    .reduce((fields, field) => [...fields, formatField(field)], [])
}

v1Router.get(
  routes.DOWNLOAD_PROJECTS_CSV,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  getProjectListCsv
)
