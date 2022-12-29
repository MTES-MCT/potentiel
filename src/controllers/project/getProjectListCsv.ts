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
  {
    dataField: 'numeroCRE',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'appelOffreId',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'periodeId',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'familleId',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Candidat',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Société mère',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'nomProjet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Territoire\n(AO ZNI)',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'puissance',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'prixReference',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: "Taux d'autoconsommation \n(AO autoconsommation)",
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'evaluationCarbone',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  { dataField: 'Note prix', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'cre'] },
  { dataField: 'Note carbone', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'cre'] },
  {
    dataField: 'Note environnementale',
    visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Note innovation\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: 'note',
    visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: 'nomCandidat',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Nature du candidat',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Numéro SIREN ou SIRET*',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Code NACE',
    visibility: ['admin', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre', 'caisse-des-dépôts'],
  },
  {
    dataField: 'Type entreprise',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: "Région d'implantation",
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Adresse',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'nomRepresentantLegal',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Titre du représentant légal',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Nom et prénom du signataire du formulaire',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Nom et prénom du contact',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Titre du contact',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Adresse postale du contact',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'email',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Téléphone',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Nom du projet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: "Nb d'aérogénérateurs\n(AO éolien)",
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Famille de candidature',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Puissance installée (MWc)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Type de consommateur associé\n(AO autoconsommation)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Typologie de projet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'adresseProjet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'codePostalProjet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'communeProjet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'departementProjet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'regionProjet',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(degrés)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(minutes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(secondes)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField:
      'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(cardinal)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Taux occupation toiture\n(AO autoconsommation)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Surface du Terrain d’implantation (ha)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Référence du dossier de raccordement*',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Dépôt 1ère périodes précédentes ?',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Prix de référence (€/MWh)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'acheteur-obligé', 'ademe'],
  },
  {
    dataField: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Terrain d’implantation est dégradé au sens du cas 3 du 2.6',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Terrain d’implantation bénéficie de la dérogation sur le c) du Cas 2 du 2.6',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Détention de l’Autorisation d’Urbanisme',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Développement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Développement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Développement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local développement :\nCommentaires',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField:
      'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField:
      'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local Fabrication de composants et assemblage :\nCommentaires',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Technologie (Modules ou films)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Référence commerciale \n(Modules ou films)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Nom du fabricant \n(Modules ou films)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Modules ou films)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Puissance crête (Wc) \n(Modules ou films)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Rendement nominal \n(Modules ou films)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût des modules €/Wc',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Diamètre du rotor (m)\n(AO éolien)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Hauteur bout de pâle (m)\n(AO éolien)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Modules ou films)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Modules ou films)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Modules ou films)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Nom du fabricant (Cellules)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication (Cellules)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Cellules)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Cellules)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Cellules)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Nom du fabricant \n(Plaquettes de silicium (wafers))',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Nom du fabricant \n(Polysilicium)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Polysilicium)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Polysilicium)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Polysilicium)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Polysilicium)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Nom du fabricant \n(Postes de conversion)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Postes de conversion)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Postes de conversion)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Postes de conversion)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Postes de conversion)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Nom du fabricant \n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Structure)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Technologie \n(Dispositifs de stockage de l’énergie *)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Technologie \n(Dispositifs de suivi de la course du soleil *)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Référence commerciale \n(Autres technologies)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Nom du fabricant \n(Autres technologies)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Lieu(x) de fabrication \n(Autres technologies)',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Autres technologies)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Autres technologies)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Autres technologies)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(Installation et mise en service )',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(Installation et mise en service) ',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(Installation et mise en service)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Commentaires contenu local\n(Installation et mise en service)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Coût total du lot (M€)\n(raccordement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local français (%)\n(raccordement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local européen (%)\n(raccordement)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local TOTAL :\ncoût total (M€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local TOTAL français (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local TOTAL européen (%)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Contenu local TOTAL :\nCommentaires',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Ensoleillement de référence (kWh/m²/an)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Productible annuel (MWh/an)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Facteur de charges (kWh/kWc)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Date de mise en service du raccordement attendue (mm/aaaa)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'cre'],
  },
  {
    dataField: 'Capacité du raccordement (kW)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'cre'],
  },
  {
    dataField: 'Montant estimé du raccordement (k€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'cre'],
  },
  {
    dataField: 'Raccordement € / kWc',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Investissement total (k€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'dont quantité de fonds propres (k€)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: "dont quantité d'endettement  (k€)",
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: "dont quantité de subventions à l'investissement  (k€)",
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: "dont quantité d'autres avantages financiers  (k€)",
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'Location (€/an/MWc)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  {
    dataField: 'CAPEX Moyen\n(k€ / MWc)',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'ademe', 'cre'],
  },
  { dataField: 'date\n(candidature)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  { dataField: 'heure\n(candidature)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  {
    dataField: 'Reference Pli\n(candidature)',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'],
  },
  {
    dataField: 'Typologie de projet',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'ademe', 'cre'],
  },
  {
    dataField: "Condition d'admissibilité ?\n(AO éolien)",
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  {
    dataField: "Type d'utorisation d'Urbanisme (pièce n°3)",
    visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'],
  },
  {
    dataField: 'isFinancementParticipatif',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: 'isInvestissementParticipatif',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: 'financementCollectif',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: 'gouvernancePartagée',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'ademe', 'cre'],
  },
  {
    dataField: '€/MWh bonus participatif',
    visibility: ['admin', 'dgec-validateur', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Note degré d’innovation (/20pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Commentaire final sur note degré d’innovation\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: "Nom de l'innovation (ADEME)\n(AO innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: "Type de l'innovation (ADEME)\n(AO innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe'],
  },
  {
    dataField: "Note synergie avec l'usage agricole (/10pt)\n(AO Innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: "Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)",
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Note positionnement sur le marché (/10pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Commentaire final sur note positionnement sur le marché \n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Note qualité technique (/5pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Commentaire final sur note qualité technique\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField:
      'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: 'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: "Respect de toutes les conditions d'admissibilité ?",
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  { dataField: 'Suspicion de doublon ? ', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Oui projet ', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: 'Suspicion de 500m inter-famille ? ',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  { dataField: 'Avis admissibilité', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 1 \n(pièce n°1)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 2 \n(pièce n°1)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis \n(pièce n°1)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 1 \n(pièce n°2)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 2 \n(pièce n°2)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis \n(pièce n°2)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: "Type de terrain d'implantation \n(pièce n°3)",
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  {
    dataField: "Période visée par certificat d'éligibilité du terrain \n(pièce n°3)",
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  { dataField: 'Comm 1 \n(pièce n°3)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 2\n(pièce n°3)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Types Cas 3 \n(pièce n°3)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis \n(pièce n°3)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: 'Comm 1\n(pièce n°4 AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  {
    dataField: 'Comm 2\n(pièce n°4 AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  { dataField: 'Avis\n(pièce n°4 AO innovation)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: 'Comm 1\n(pièce n°5 AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  {
    dataField: 'Comm 2\n(pièce n°5 AO innovation)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  { dataField: 'Avis\n(pièce n°5 AO innovation)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: "Type d'AU \n(pièce n°4)",
    visibility: ['admin', 'dgec-validateur', 'ademe', 'cre'],
  },
  { dataField: 'Date \n(pièce n°4)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 2 \n(pièce n°4)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis \n(pièce n°4)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 1 \n(pièce n°6)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 2 \n(pièce n°6)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis \n(pièce n°6)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Oui/non ? \n(pièce n°7)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 1 \n(pièce n°7)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Comm 2 \n(pièce n°7)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis \n(pièce n°7)', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: 'Comm 1 \n(Délégation de signature)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  {
    dataField: 'Comm 2 \n(Délégation de signature)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  {
    dataField: 'Avis \n(Délégation de signature)',
    visibility: ['admin', 'dgec-validateur', 'cre'],
  },
  { dataField: 'Commentaire final', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis final', visibility: ['admin', 'dgec-validateur', 'cre'] },
  { dataField: 'Avis final CRE + ADEME', visibility: ['admin', 'dgec-validateur', 'cre'] },
  {
    dataField: 'Puissance cumulée',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'classe',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  { dataField: 'Prix Majoré', visibility: ['admin', 'dgec-validateur', 'acheteur-obligé', 'cre'] },
  { dataField: 'Codes cas\n(AO sol)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  { dataField: 'Codes cas 2\n(AO sol)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  { dataField: 'Codes cas 3\n(AO sol)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  {
    dataField: 'motifsElimination',
    visibility: [
      'admin',
      'porteur-projet',
      'dreal',
      'acheteur-obligé',
      'ademe',
      'dgec-validateur',
      'cre',
    ],
  },
  { dataField: 'Nom projet (doublon)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  { dataField: 'CP (doublon)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  { dataField: 'Commune (doublon)', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  {
    dataField: 'Modifications',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'Statut',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  {
    dataField: 'notifiedOn',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé', 'cre'],
  },
  { dataField: 'Commentaires', visibility: ['admin', 'dgec-validateur', 'dreal', 'cre'] },
  {
    dataField: 'Type de modification 1',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Date de modification 1',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Colonne concernée 1',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Ancienne valeur 1',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Type de modification 2',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Date de modification 2',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Colonne concernée 2',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Ancienne valeur 2',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Type de modification 3',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Date de modification 3',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Colonne concernée 3',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Ancienne valeur 3',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Type de modification 4',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Date de modification 4',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Colonne concernée 4',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Ancienne valeur 4',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Type de modification 5',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Date de modification 5',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Colonne concernée 5',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'Ancienne valeur 5',
    visibility: ['admin', 'dgec-validateur', 'dreal', 'porteur-projet', 'acheteur-obligé'],
  },
  {
    dataField: 'garantiesFinancières.dateConstitution',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'garantiesFinancières.dateEnvoi',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'caisse-des-dépôts',
    ],
  },
  {
    dataField: 'technologie',
    visibility: [
      'admin',
      'dgec-validateur',
      'dreal',
      'porteur-projet',
      'acheteur-obligé',
      'ademe',
      'cre',
      'caisse-des-dépôts',
    ],
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
    .filter((field) => field.visibility.includes(userRole))
    .reduce((fields, field) => [...fields, formatField(field)], [])
}

v1Router.get(
  routes.DOWNLOAD_PROJECTS_CSV,
  vérifierPermissionUtilisateur(PermissionListerProjets),
  getProjectListCsv
)
