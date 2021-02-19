import { Pagination } from '../../types'
import { listProjects } from '../../useCases'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { parseAsync } from 'json2csv'
import { logger } from '../../core/utils'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { ensureLoggedIn } from '../auth'
import { promises as fsPromises } from 'fs'
import moment from 'moment'
import { Project } from '../../entities'
import { formatField, writeCsvOnDisk } from '../../helpers/csv'

const orderedFields = [
  { name: 'numeroCRE', visibility: ['*'] },
  { name: 'appelOffreId', visibility: ['*'] },
  { name: 'periodeId', visibility: ['*'] },
  { name: 'familleId', visibility: ['*'] },
  { name: 'Candidat', visibility: ['*'] },
  { name: 'Société mère', visibility: ['*'] },
  { name: 'nomProjet', visibility: ['*'] },
  { name: 'Territoire\n(AO ZNI)', visibility: ['*'] },
  { name: 'puissance', visibility: ['*'] },
  { name: 'prixReference', visibility: ['admin', 'porteur-projet', 'edfoa'] },
  { name: "Taux d'autoconsommation \n(AO autoconsommation)", visibility: ['*'] },
  { name: 'evaluationCarbone', visibility: ['*'] },
  { name: 'Note prix', visibility: ['admin', 'edfoa'] },
  { name: 'Note carbone', visibility: ['admin', 'edfoa'] },
  { name: 'Note environnementale', visibility: ['admin', 'edfoa'] },
  { name: 'Note innovation\n(AO innovation)', visibility: ['admin', 'edfoa'] },
  { name: 'note', visibility: ['admin', 'edfoa'] },
  { name: 'nomCandidat', visibility: ['*'] },
  { name: 'Nature du candidat', visibility: ['*'] },
  { name: 'Numéro SIREN ou SIRET*', visibility: ['*'] },
  { name: 'Code NACE', visibility: ['*'] },
  { name: 'Type entreprise', visibility: ['*'] },
  { name: "Région d'implantation", visibility: ['*'] },
  { name: 'Adresse', visibility: ['*'] },
  { name: 'nomRepresentantLegal', visibility: ['*'] },
  { name: 'Titre du représentant légal', visibility: ['*'] },
  { name: 'Nom et prénom du signataire du formulaire', visibility: ['*'] },
  { name: 'Nom et prénom du contact', visibility: ['*'] },
  { name: 'Titre du contact', visibility: ['*'] },
  { name: 'Adresse postale du contact', visibility: ['*'] },
  { name: 'email', visibility: ['*'] },
  { name: 'Téléphone', visibility: ['*'] },
  { name: 'Nom du projet', visibility: ['*'] },
  { name: "Nb d'aérogénérateurs\n(AO éolien)", visibility: ['*'] },
  { name: 'Famille de candidature', visibility: ['*'] },
  { name: 'Puissance installée (MWc)', visibility: ['*'] },
  { name: 'Type de consommateur associé\n(AO autoconsommation)', visibility: ['*'] },
  { name: 'Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)', visibility: ['*'] },
  { name: 'Typologie de projet', visibility: ['*'] },
  { name: 'adresseProjet', visibility: ['*'] },
  { name: 'codePostalProjet', visibility: ['*'] },
  { name: 'communeProjet', visibility: ['*'] },
  { name: 'departementProjet', visibility: ['*'] },
  { name: 'regionProjet', visibility: ['*'] },
  {
    name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(degrés)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(minutes)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(secondes)',
    visibility: ['*'],
  },
  {
    name: 'Coordonnées géodésiques WGS84du barycentre de l’Installation : Longitude\n(cardinal)',
    visibility: ['*'],
  },
  { name: 'Taux occupation toiture\n(AO autoconsommation)', visibility: ['*'] },
  { name: 'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)', visibility: ['*'] },
  { name: 'Surface du Terrain d’implantation (ha)', visibility: ['*'] },
  { name: 'Référence du dossier de raccordement*', visibility: ['*'] },
  { name: 'Dépôt 1ère périodes précédentes ?', visibility: ['*'] },
  { name: 'Prix de référence (€/MWh)', visibility: ['admin', 'porteur-projet', 'edfoa'] },
  { name: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)', visibility: ['*'] },
  { name: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)', visibility: ['*'] },
  { name: 'Terrain d’implantation est dégradé au sens du cas 3 du 2.6', visibility: ['*'] },
  {
    name: 'Terrain d’implantation bénéficie de la dérogation sur le c) du Cas 2 du 2.6',
    visibility: ['*'],
  },
  { name: 'Détention de l’Autorisation d’Urbanisme', visibility: ['*'] },
  { name: 'Coût total du lot (M€)\n(Développement)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local français (%)\n(Développement)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local européen (%)\n(Développement)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local développement :\nCommentaires', visibility: ['admin', 'porteur-projet'] },
  {
    name: 'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name:
      'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name:
      'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local Fabrication de composants et assemblage :\nCommentaires',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Technologie (Modules ou films)', visibility: ['*'] },
  { name: 'Référence commerciale \n(Modules ou films)', visibility: ['*'] },
  { name: 'Nom du fabricant \n(Modules ou films)', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication \n(Modules ou films)', visibility: ['*'] },
  { name: 'Puissance crête (Wc) \n(Modules ou films)', visibility: ['*'] },
  { name: 'Rendement nominal \n(Modules ou films)', visibility: ['*'] },
  { name: 'Coût des modules €/Wc', visibility: ['admin', 'porteur-projet'] },
  { name: 'Diamètre du rotor (m)\n(AO éolien)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Hauteur bout de pâle (m)\n(AO éolien)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Coût total du lot (M€)\n(Modules ou films)', visibility: ['admin', 'porteur-projet'] },
  {
    name: 'Contenu local français (%)\n(Modules ou films)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Modules ou films)',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Nom du fabricant (Cellules)', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication (Cellules)', visibility: ['*'] },
  { name: 'Coût total du lot (M€)\n(Cellules)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local français (%)\n(Cellules)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local européen (%)\n(Cellules)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Nom du fabricant \n(Plaquettes de silicium (wafers))', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))', visibility: ['*'] },
  {
    name: 'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Nom du fabricant \n(Polysilicium)', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication \n(Polysilicium)', visibility: ['*'] },
  { name: 'Coût total du lot (M€)\n(Polysilicium)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local français (%)\n(Polysilicium)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local européen (%)\n(Polysilicium)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Nom du fabricant \n(Postes de conversion)', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication \n(Postes de conversion)', visibility: ['*'] },
  {
    name: 'Coût total du lot (M€)\n(Postes de conversion)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local français (%)\n(Postes de conversion)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Postes de conversion)',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Nom du fabricant \n(Structure)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Lieu(x) de fabrication \n(Structure)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Coût total du lot (M€)\n(Structure)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local français (%)\n(Structure)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local européen (%)\n(Structure)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Technologie \n(Dispositifs de stockage de l’énergie *)', visibility: ['*'] },
  { name: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)', visibility: ['*'] },
  {
    name: 'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Technologie \n(Dispositifs de suivi de la course du soleil *)', visibility: ['*'] },
  { name: 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)', visibility: ['*'] },
  {
    name: 'Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['*'],
  },
  {
    name: 'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Référence commerciale \n(Autres technologies)', visibility: ['*'] },
  { name: 'Nom du fabricant \n(Autres technologies)', visibility: ['*'] },
  { name: 'Lieu(x) de fabrication \n(Autres technologies)', visibility: ['*'] },
  {
    name: 'Coût total du lot (M€)\n(Autres technologies)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local français (%)\n(Autres technologies)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Autres technologies)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Coût total du lot (M€)\n(Installation et mise en service )',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local français (%)\n(Installation et mise en service) ',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Contenu local européen (%)\n(Installation et mise en service)',
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: 'Commentaires contenu local\n(Installation et mise en service)',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Coût total du lot (M€)\n(raccordement)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local français (%)\n(raccordement)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local européen (%)\n(raccordement)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local TOTAL :\ncoût total (M€)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local TOTAL français (%)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local TOTAL européen (%)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Contenu local TOTAL :\nCommentaires', visibility: ['admin', 'porteur-projet'] },
  { name: 'Ensoleillement de référence (kWh/m²/an)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Productible annuel (MWh/an)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Facteur de charges (kWh/kWc)', visibility: ['admin', 'porteur-projet'] },
  {
    name: 'Date de mise en service du raccordement attendue (mm/aaaa)',
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Capacité du raccordement (kW)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Montant estimé du raccordement (k€)', visibility: ['admin', 'porteur-projet'] },
  { name: 'Raccordement € / kWc', visibility: ['admin', 'porteur-projet'] },
  { name: 'Investissement total (k€)', visibility: ['admin', 'porteur-projet'] },
  { name: 'dont quantité de fonds propres (k€)', visibility: ['admin', 'porteur-projet'] },
  { name: "dont quantité d'endettement  (k€)", visibility: ['admin', 'porteur-projet'] },
  {
    name: "dont quantité de subventions à l'investissement  (k€)",
    visibility: ['admin', 'porteur-projet'],
  },
  {
    name: "dont quantité d'autres avantages financiers  (k€)",
    visibility: ['admin', 'porteur-projet'],
  },
  { name: 'Location (€/an/MWc)', visibility: ['admin', 'porteur-projet'] },
  { name: 'CAPEX Moyen\n(k€ / MWc)', visibility: ['admin', 'porteur-projet'] },
  { name: 'date\n(candidature)', visibility: ['admin', 'dreal'] },
  { name: 'heure\n(candidature)', visibility: ['admin', 'dreal'] },
  { name: 'Reference Pli\n(candidature)', visibility: ['admin', 'dreal'] },
  { name: 'Typologie de projet', visibility: ['admin', 'dreal'] },
  { name: "Condition d'admissibilité ?\n(AO éolien)", visibility: ['admin'] },
  { name: "Type d'utorisation d'Urbanisme (pièce n°3)", visibility: ['admin', 'dreal'] },
  {
    name: 'Investissement ou financement participatif ?',
    fn: (row) => row.isInvestissementParticipatif || row.isFinancementParticipatif,
    visibility: ['admin', 'dreal', 'edfoa'],
  },
  { name: '€/MWh bonus participatif', visibility: ['admin', 'porteur-projet', 'edfoa'] },
  { name: 'Note degré d’innovation (/20pt)\n(AO innovation)', visibility: ['admin'] },
  { name: 'Commentaire final sur note degré d’innovation\n(AO innovation)', visibility: ['admin'] },
  { name: "Nom de l'innovation (ADEME)\n(AO innovation)", visibility: ['admin'] },
  { name: "Type de l'innovation (ADEME)\n(AO innovation)", visibility: ['admin'] },
  { name: "Note synergie avec l'usage agricole (/10pt)\n(AO Innovation)", visibility: ['admin'] },
  {
    name: "Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)",
    visibility: ['admin'],
  },
  { name: 'Note positionnement sur le marché (/10pt)\n(AO innovation)', visibility: ['admin'] },
  {
    name: 'Commentaire final sur note positionnement sur le marché \n(AO innovation)',
    visibility: ['admin'],
  },
  { name: 'Note qualité technique (/5pt)\n(AO innovation)', visibility: ['admin'] },
  { name: 'Commentaire final sur note qualité technique\n(AO innovation)', visibility: ['admin'] },
  {
    name: 'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)',
    visibility: ['admin'],
  },
  {
    name:
      'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)',
    visibility: ['admin'],
  },
  {
    name: 'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)',
    visibility: ['admin'],
  },
  {
    name: 'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)',
    visibility: ['admin'],
  },
  { name: "Respect de toutes les conditions d'admissibilité ?", visibility: ['admin'] },
  { name: 'Suspicion de doublon ? ', visibility: ['admin'] },
  { name: 'Oui projet ', visibility: ['admin'] },
  { name: 'Suspicion de 500m inter-famille ? ', visibility: ['admin'] },
  { name: 'Avis admissibilité', visibility: ['admin'] },
  { name: 'Comm 1 \n(pièce n°1)', visibility: ['admin'] },
  { name: 'Comm 2 \n(pièce n°1)', visibility: ['admin'] },
  { name: 'Avis \n(pièce n°1)', visibility: ['admin'] },
  { name: 'Comm 1 \n(pièce n°2)', visibility: ['admin'] },
  { name: 'Comm 2 \n(pièce n°2)', visibility: ['admin'] },
  { name: 'Avis \n(pièce n°2)', visibility: ['admin'] },
  { name: "Type de terrain d'implantation \n(pièce n°3)", visibility: ['admin'] },
  {
    name: "Période visée par certificat d'éligibilité du terrain \n(pièce n°3)",
    visibility: ['admin'],
  },
  { name: 'Comm 1 \n(pièce n°3)', visibility: ['admin'] },
  { name: 'Comm 2\n(pièce n°3)', visibility: ['admin'] },
  { name: 'Types Cas 3 \n(pièce n°3)', visibility: ['admin'] },
  { name: 'Avis \n(pièce n°3)', visibility: ['admin'] },
  { name: 'Comm 1\n(pièce n°4 AO innovation)', visibility: ['admin'] },
  { name: 'Comm 2\n(pièce n°4 AO innovation)', visibility: ['admin'] },
  { name: 'Avis\n(pièce n°4 AO innovation)', visibility: ['admin'] },
  { name: 'Comm 1\n(pièce n°5 AO innovation)', visibility: ['admin'] },
  { name: 'Comm 2\n(pièce n°5 AO innovation)', visibility: ['admin'] },
  { name: 'Avis\n(pièce n°5 AO innovation)', visibility: ['admin'] },
  { name: "Type d'AU \n(pièce n°4)", visibility: ['admin'] },
  { name: 'Date \n(pièce n°4)', visibility: ['admin'] },
  { name: 'Comm 2 \n(pièce n°4)', visibility: ['admin'] },
  { name: 'Avis \n(pièce n°4)', visibility: ['admin'] },
  { name: 'Comm 1 \n(pièce n°6)', visibility: ['admin'] },
  { name: 'Comm 2 \n(pièce n°6)', visibility: ['admin'] },
  { name: 'Avis \n(pièce n°6)', visibility: ['admin'] },
  { name: 'Oui/non ? \n(pièce n°7)', visibility: ['admin'] },
  { name: 'Comm 1 \n(pièce n°7)', visibility: ['admin'] },
  { name: 'Comm 2 \n(pièce n°7)', visibility: ['admin'] },
  { name: 'Avis \n(pièce n°7)', visibility: ['admin'] },
  { name: 'Comm 1 \n(Délégation de signature)', visibility: ['admin'] },
  { name: 'Comm 2 \n(Délégation de signature)', visibility: ['admin'] },
  { name: 'Avis \n(Délégation de signature)', visibility: ['admin'] },
  { name: 'Commentaire final', visibility: ['admin'] },
  { name: 'Avis final', visibility: ['admin'] },
  { name: 'Avis final CRE + ADEME', visibility: ['admin'] },
  { name: 'Puissance cumulée', visibility: ['admin', 'dreal', 'edfoa'] },
  { name: 'classe', visibility: ['*'] },
  { name: 'Prix Majoré', visibility: ['admin', 'edfoa'] },
  { name: 'Codes cas\n(AO sol)', visibility: ['admin', 'dreal'] },
  { name: 'Codes cas 2\n(AO sol)', visibility: ['admin', 'dreal'] },
  { name: 'Codes cas 3\n(AO sol)', visibility: ['admin', 'dreal'] },
  { name: 'motifsElimination', visibility: ['*'] },
  { name: 'Nom projet (doublon)', visibility: ['admin', 'dreal'] },
  { name: 'CP (doublon)', visibility: ['admin', 'dreal'] },
  { name: 'Commune (doublon)', visibility: ['admin', 'dreal'] },
  { name: 'Modifications', visibility: ['*'] },
  { name: 'Statut', visibility: ['*'] },
  { name: 'notifiedOn', visibility: ['*'] },
  { name: 'Commentaires', visibility: ['admin', 'dreal'] },
  { name: 'Type de modification 1', visibility: ['*'] },
  { name: 'Date de modification 1', visibility: ['*'] },
  { name: 'Colonne concernée 1', visibility: ['*'] },
  { name: 'Ancienne valeur 1', visibility: ['*'] },
  { name: 'Type de modification 2', visibility: ['*'] },
  { name: 'Date de modification 2', visibility: ['*'] },
  { name: 'Colonne concernée 2', visibility: ['*'] },
  { name: 'Ancienne valeur 2', visibility: ['*'] },
  { name: 'Type de modification 3', visibility: ['*'] },
  { name: 'Date de modification 3', visibility: ['*'] },
  { name: 'Colonne concernée 3', visibility: ['*'] },
  { name: 'Ancienne valeur 3', visibility: ['*'] },
  { name: 'Type de modification 4', visibility: ['*'] },
  { name: 'Date de modification 4', visibility: ['*'] },
  { name: 'Colonne concernée 4', visibility: ['*'] },
  { name: 'Ancienne valeur 4', visibility: ['*'] },
  { name: 'Type de modification 5', visibility: ['*'] },
  { name: 'Date de modification 5', visibility: ['*'] },
  { name: 'Colonne concernée 5', visibility: ['*'] },
  { name: 'Ancienne valeur 5', visibility: ['*'] },
  { name: 'garantiesFinancieresDate', visibility: ['*'] },
  { name: 'garantiesFinancieresSubmittedOn', visibility: ['*'] },
]

const getProjectListCsv = asyncHandler(async (request, response) => {
  let {
    appelOffreId,
    periodeId,
    familleId,
    recherche,
    classement,
    garantiesFinancieres,
  } = request.query

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

    _convertTimestampToFrenchDateFormat(projects)

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

function _convertTimestampToFrenchDateFormat(projects: Project[]): void {
  const timestampsFields = [
    'notifiedOn',
    'garantiesFinancieresSubmittedOn',
    'garantiesFinancieresDate',
  ]

  projects.forEach((project) => {
    Object.entries(project).forEach(([key, value]) => {
      if (timestampsFields.includes(key) && project[key] !== 0)
        project[key] = moment(Number(value)).format('DD/MM/YYYY')
    })
  })
}

function _selectFieldsForRole(userRole: string): { label: string; value: string | Function }[] {
  return orderedFields
    .filter((field) => field.visibility.includes(userRole) || field.visibility.includes('*'))
    .reduce((fields, field) => [...fields, formatField(field)], [])
}

v1Router.get(routes.DOWNLOAD_PROJECTS_CSV, ensureLoggedIn(), getProjectListCsv)
