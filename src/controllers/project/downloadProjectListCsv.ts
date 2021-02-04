import { Pagination } from '../../types'
import { v4 as uuid } from 'uuid'
import { listProjects } from '../../useCases'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { parseAsync } from 'json2csv'
import { promisify } from 'util'
import { logger } from '../../core/utils'
import { additionalFields, commonDataFields } from '../../dataAccess/inMemory/appelsOffres'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { writeFile } from 'fs'
import { ensureLoggedIn } from '../auth'
const writeFileAsync = promisify(writeFile)

const downloadProjectListCsv = asyncHandler(async (request, response) => {
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

  const results = await listProjects({
    user: request.user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
    classement,
    garantiesFinancieres,
  })

  const { projects } = results

  try {
    const commonDataFieldsFlattened = [...commonDataFields, ...additionalFields].reduce(
      (acc, currField) => {
        return { ...acc, [currField.field]: currField.column }
      },
      {}
    )

    const orderedFields = [
      { name: 'numeroCRE' },
      { name: 'appelOffreId' },
      { name: 'periodeId' },
      { name: 'familleId' },
      { name: 'nomCandidat' },
      { name: 'Société mère' },
      { name: 'nomProjet' },
      { name: 'Territoire\n(AO ZNI)' },
      { name: 'puissance' },
      { name: 'prixReference', hiddenFor: ['dreal'] },
      { name: "Taux d'autoconsommation \n(AO autoconsommation)" },
      { name: 'evaluationCarbone' },
      { name: 'Note prix', hiddenFor: ['porteur-projet', 'dreal'] },
      { name: 'Note carbone', hiddenFor: ['porteur-projet', 'dreal'] },
      { name: 'Note environnementale', hiddenFor: ['porteur-projet', 'dreal'] },
      { name: 'Note innovation\n(AO innovation)', hiddenFor: ['porteur-projet', 'dreal'] },
      { name: 'note', hiddenFor: ['porteur-projet', 'dreal'] },
      { name: 'nomCandidat' },
      { name: 'Nature du candidat' },
      { name: 'Numéro SIREN ou SIRET*' },
      { name: 'Code NACE' },
      { name: 'Type entreprise' },
      { name: "Région d'implantation" },
      { name: 'Adresse' },
      { name: 'nomRepresentantLegal' },
      { name: 'Titre du représentant légal' },
      { name: 'Nom et prénom du signataire du formulaire' },
      { name: 'Nom et prénom du contact' },
      { name: 'Titre du contact' },
      { name: 'Adresse postale du contact' },
      { name: 'email' },
      { name: 'Téléphone' },
      { name: "Nb d'aérogénérateurs\n(AO éolien)" },
      { name: 'Puissance installée (MWc)' },
      { name: 'Type de consommateur associé\n(AO autoconsommation)' },
      { name: 'Nature et nombre du ou des consommateur(s)\n(AO autoconsommation)' },
      { name: 'Typologie de projet' },
      { name: 'adresseProjet' },
      { name: 'codePostalProjet' },
      { name: 'communeProjet' },
      { name: 'departementProjet' },
      { name: 'regionProjet' },
      {
        name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (degrés)',
      },
      {
        name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (minutes)',
      },
      {
        name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (secondes)',
      },
      {
        name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Latitude (cardinal)',
      },
      {
        name: 'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude\n(degrés)',
      },
      {
        name:
          'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude\n(minutes)',
      },
      {
        name:
          'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude\n(secondes)',
      },
      {
        name:
          'Coordonnées géodésiques WGS84 du barycentre de l’Installation : Longitude\n(cardinal)',
      },
      { name: 'Taux occupation toiture\n(AO autoconsommation)' },
      { name: 'Surface projetée au sol de l’ensemble des Capteurs solaires (ha)' },
      { name: 'Surface du Terrain d’implantation (ha)' },
      { name: 'Référence du dossier de raccordement*' },
      { name: 'Dépôt 1ère périodes précédentes ?' },
      { name: 'Prix de référence (€/MWh)', hiddenFor: ['dreal'] },
      { name: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)' },
      { name: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)' },
      { name: 'Terrain d’implantation est dégradé au sens du cas 3 du 2.6' },
      { name: 'Terrain d’implantation bénéficie de la dérogation sur le c) du Cas 2 du 2.6' },
      { name: 'Détention de l’Autorisation d’Urbanisme' },
      { name: 'Coût total du lot (M€)\n(Développement)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(Développement)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(Développement)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local développement :\nCommentaires', hiddenFor: ['dreal', 'edfoa'] },
      {
        name: 'Contenu local Fabrication de composants et assemblage :\nTotal coût du lot (M€)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name:
          'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local français (%)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name:
          'Contenu local Fabrication de composants et assemblage :\nPourcentage de contenu local européen (%)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local Fabrication de composants et assemblage :\nCommentaires',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Technologie (Modules ou films)' },
      { name: 'Référence commerciale \n(Modules ou films)' },
      { name: 'Nom du fabricant \n(Modules ou films)' },
      { name: 'Lieu(x) de fabrication \n(Modules ou films)' },
      { name: 'Puissance crête (Wc) \n(Modules ou films)' },
      { name: 'Rendement nominal \n(Modules ou films)' },
      { name: 'Coût des modules €/Wc', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Diamètre du rotor (m)\n(AO éolien)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Hauteur bout de pâle (m)\n(AO éolien)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Coût total du lot (M€)\n(Modules ou films)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(Modules ou films)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(Modules ou films)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Nom du fabricant (Cellules)' },
      { name: 'Lieu(x) de fabrication (Cellules)' },
      { name: 'Coût total du lot (M€)\n(Cellules)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(Cellules)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(Cellules)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Nom du fabricant \n(Plaquettes de silicium (wafers))' },
      { name: 'Lieu(x) de fabrication \n(Plaquettes de silicium (wafers))' },
      {
        name: 'Coût total du lot (M€)\n(Plaquettes de silicium (wafers))',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local français (%)\n(Plaquettes de silicium (wafers))',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local européen (%)\n(Plaquettes de silicium (wafers))',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Nom du fabricant \n(Polysilicium)' },
      { name: 'Lieu(x) de fabrication \n(Polysilicium)' },
      { name: 'Coût total du lot (M€)\n(Polysilicium)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(Polysilicium)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(Polysilicium)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Nom du fabricant \n(Postes de conversion)' },
      { name: 'Lieu(x) de fabrication \n(Postes de conversion)' },
      { name: 'Coût total du lot (M€)\n(Postes de conversion)', hiddenFor: ['dreal', 'edfoa'] },
      {
        name: 'Contenu local français (%)\n(Postes de conversion)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local européen (%)\n(Postes de conversion)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Nom du fabricant \n(Structure)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Lieu(x) de fabrication \n(Structure)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Coût total du lot (M€)\n(Structure)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(Structure)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(Structure)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Technologie \n(Dispositifs de stockage de l’énergie *)' },
      { name: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)' },
      { name: 'Lieu(x) de fabrication \n(Dispositifs de stockage de l’énergie *)' },
      {
        name: 'Coût total du lot (M€)\n(Dispositifs de stockage de l’énergie *)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local français (%)\n(Dispositifs de stockage de l’énergie *)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local européen (%)\n(Dispositifs de stockage de l’énergie *)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Technologie \n(Dispositifs de suivi de la course du soleil *)' },
      { name: 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)' },
      { name: 'Lieu(x) de fabrication \n(Dispositifs de suivi de la course du soleil *)' },
      {
        name: 'Coût total du lot (M€)\n(Dispositifs de suivi de la course du soleil *)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local français (%)\n(Dispositifs de suivi de la course du soleil *)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local européen (%)\n(Dispositifs de suivi de la course du soleil *)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Référence commerciale \n(Autres technologies)' },
      { name: 'Nom du fabricant \n(Autres technologies)' },
      { name: 'Lieu(x) de fabrication \n(Autres technologies)' },
      { name: 'Coût total du lot (M€)\n(Autres technologies)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(Autres technologies)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(Autres technologies)', hiddenFor: ['dreal', 'edfoa'] },
      {
        name: 'Coût total du lot (M€)\n(Installation et mise en service )',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local français (%)\n(Installation et mise en service) ',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Contenu local européen (%)\n(Installation et mise en service)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      {
        name: 'Commentaires contenu local\n(Installation et mise en service)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Coût total du lot (M€)\n(raccordement)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local français (%)\n(raccordement)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local européen (%)\n(raccordement)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local TOTAL :\ncoût total (M€)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local TOTAL français (%)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local TOTAL européen (%)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Contenu local TOTAL :\nCommentaires', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Ensoleillement de référence (kWh/m²/an)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Productible annuel (MWh/an)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Facteur de charges (kWh/kWc)', hiddenFor: ['dreal', 'edfoa'] },
      {
        name: 'Date de mise en service du raccordement attendue (mm/aaaa)',
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: 'Capacité du raccordement (kW)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Montant estimé du raccordement (k€)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Raccordement € / kWc', hiddenFor: ['dreal', 'edfoa'] },
      { name: ' Investissement total (k€) ', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'dont quantité de fonds propres (k€)', hiddenFor: ['dreal', 'edfoa'] },
      { name: "dont quantité d'endettement  (k€)", hiddenFor: ['dreal', 'edfoa'] },
      {
        name: "dont quantité de subventions à l'investissement  (k€)",
        hiddenFor: ['dreal', 'edfoa'],
      },
      { name: "dont quantité d'autres avantages financiers  (k€)", hiddenFor: ['dreal', 'edfoa'] },
      { name: 'Location (€/an/MWc)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'CAPEX Moyen\n(k€ / MWc)', hiddenFor: ['dreal', 'edfoa'] },
      { name: 'date\n(candidature)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'heure\n(candidature)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'Reference Pli\n(candidature)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'Typologie de projet', hiddenFor: ['porteur-projet', 'edfoa'] },
      {
        name: "Condition d'admissibilité ?\n(AO éolien)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Type d'utorisation d'Urbanisme (pièce n°3)",
        hiddenFor: ['porteur-projet', 'edfoa'],
      },
      {
        name: 'Investissement ou financement participatif\n(Oui/non) ?',
        hiddenFor: ['porteur-projet'],
      },
      { name: 'Investissement ou financement participatif ?', hiddenFor: ['porteur-projet'] },
      { name: '€/MWh bonus participatif' },
      {
        name: 'Note degré d’innovation (/20pt)\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Commentaire final sur note degré d’innovation\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Nom de l'innovation (ADEME)\n(AO innovation)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Type de l'innovation (ADEME)\n(AO innovation)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Note synergie avec l'usage agricole (/10pt)↵(AO Innoveation)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Commentaire final sur note synergie avec l'usage agricole \n(AO Innovation)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Note positionnement sur le marché (/10pt)\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Commentaire final sur note positionnement sur le marché \n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Note qualité technique (/5pt)\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Commentaire final sur note qualité technique\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name:
          'Commentaire final sur note adéquation du projet avec les ambitions industrielles\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Commentaire final sur note aspects environnementaux et sociaux\n(AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Respect de toutes les conditions d'admissibilité ?",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      { name: 'Suspicion de doublon ? ', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Oui projet ', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      {
        name: 'Suspicion de 500m inter-famille ? ',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      { name: 'Avis admissibilité', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 1 \n(pièce n°1)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 2 \n(pièce n°1)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis \n(pièce n°1)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 1 \n(pièce n°2)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 2 \n(pièce n°2)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis \n(pièce n°2)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      {
        name: "Type de terrain d'implantation \n(pièce n°3)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: "Période visée par certificat d'éligibilité du terrain \n(pièce n°3)",
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      { name: 'Comm 1 \n(pièce n°3)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 2\n(pièce n°3)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Types Cas 3 \n(pièce n°3)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis \n(pièce n°3)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      {
        name: 'Comm 1\n(pièce n°4 AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Comm 2\n(pièce n°4 AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      { name: 'Avis\n(pièce n°4 AO innovation)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      {
        name: 'Comm 1\n(pièce n°5 AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Comm 2\n(pièce n°5 AO innovation)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      { name: 'Avis\n(pièce n°5 AO innovation)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: "Type d'AU \n(pièce n°4)", hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Date \n(pièce n°4)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 2 \n(pièce n°4)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis \n(pièce n°4)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 1 \n(pièce n°6)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 2 \n(pièce n°6)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis \n(pièce n°6)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Oui/non ? \n(pièce n°7)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 1 \n(pièce n°7)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Comm 2 \n(pièce n°7)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis \n(pièce n°7)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      {
        name: 'Comm 1\n(piècetion de signature)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      {
        name: 'Comm 2\n(piècetion de signature)',
        hiddenFor: ['porteur-projet', 'dreal', 'edfoa'],
      },
      { name: 'Avis\n(piècetion de signature)', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Commentaire final', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis final', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Avis final CRE + ADEME', hiddenFor: ['porteur-projet', 'dreal', 'edfoa'] },
      { name: 'Puissance cumulée', hiddenFor: ['porteur-projet'] },
      { name: 'classe' },
      { name: 'Prix Majoré', hiddenFor: ['porteur-projet', 'dreal'] },
      { name: 'Codes cas\n(AO sol)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'motifsElimination' },
      { name: 'Nom projet (doublon)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'CP (doublon)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'Commune (doublon)', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'Modifications' },
      { name: 'Statut' },
      { name: 'notifiedOn' },
      { name: 'Commentaires', hiddenFor: ['porteur-projet', 'edfoa'] },
      { name: 'Type de modification 1' },
      { name: 'Date de modification 1' },
      { name: 'Colonne concernée 1' },
      { name: 'Ancienne valeur 1' },
      { name: 'Type de modification 2' },
      { name: 'Date de modification 2' },
      { name: 'Colonne concernée 2' },
      { name: 'Ancienne valeur 2' },
      { name: 'Type de modification 3' },
      { name: 'Date de modification 3' },
      { name: 'Colonne concernée 3' },
      { name: 'Ancienne valeur 3' },
      { name: 'Type de modification 4' },
      { name: 'Date de modification 4' },
      { name: 'Colonne concernée 4' },
      { name: 'Ancienne valeur 4' },
      { name: 'Type de modification 5' },
      { name: 'Date de modification 5' },
      { name: 'Colonne concernée 5' },
      { name: 'Ancienne valeur 5' },
    ]

    const userRole = request.user.role

    const fields = orderedFields
      .filter((field) => !field.hiddenFor?.includes(userRole))
      .reduce((acc, field) => [...acc, formatField(field.name, commonDataFieldsFlattened)], [])

    const csv = await parseAsync(projects.items, { fields })
    const csvFilePath = `/tmp/${uuid()}.csv`
    await writeFileAsync(csvFilePath, csv)

    return response.type('text/csv').sendFile(csvFilePath)
  } catch (error) {
    logger.error(error)
    return response.status(500).send(error)
  }
})

function formatField(fieldName: string, commonDataFieldsFlattened: object): object {
  const fieldIsCommonDataField = Object.keys(commonDataFieldsFlattened).includes(fieldName)

  return {
    label: fieldIsCommonDataField ? commonDataFieldsFlattened[fieldName] : fieldName,
    value: fieldIsCommonDataField ? fieldName : `details.${fieldName}`,
  }
}

v1Router.get(routes.DOWNLOAD_PROJECTS_CSV, ensureLoggedIn(), downloadProjectListCsv)
