import { LegacyModificationDTO, LegacyModificationStatus } from '../../modificationRequest'
import moment from 'moment-timezone'
import { UniqueEntityID } from '@core/domain'
moment.tz.setDefault('Europe/Paris')

export const parseProjectModifications = (line: Record<string, string>) => {
  const modificationsByDate: Record<string, LegacyModificationDTO> = {}
  for (const index of [1, 2, 3, 4, 5]) {
    if (line[`Type de modification ${index}`]) {
      const date = line[`Date de modification ${index}`]
      modificationsByDate[date] = extractModificationType(line, index, modificationsByDate[date])
    }
  }

  return Object.values(modificationsByDate)
}

function extractRecoursType(args: {
  modifiedOn: number
  colonneConcernee: string
  ancienneValeur: string
  index: number
  sameDateModification: LegacyModificationDTO | undefined
  nomCourrier: string
  status: LegacyModificationStatus
}): LegacyModificationDTO {
  const {
    colonneConcernee,
    modifiedOn,
    ancienneValeur,
    index,
    sameDateModification,
    nomCourrier,
    status,
  } = args
  if (!['Classé ?', "Motif d'élimination"].includes(colonneConcernee)) {
    throw new Error(
      `Colonne concernée ${index} doit être soit "Classé ?" soit "Motif d'élimination" pour un Recours gracieux`
    )
  }

  if (colonneConcernee === 'Classé ?') {
    if (!['Classé', 'Eliminé'].includes(ancienneValeur)) {
      throw new Error(
        `Ancienne valeur ${index} doit être soit Classé soit Eliminé pour un Recours gracieux`
      )
    }

    return {
      type: 'recours',
      projectId: '',
      modifiedOn,
      motifElimination: '',
      modificationId: new UniqueEntityID().toString(),
      filename: nomCourrier,
      status,
    } as LegacyModificationDTO
  } else {
    return {
      ...sameDateModification,
      motifElimination: ancienneValeur,
      filename: nomCourrier,
      status,
    } as LegacyModificationDTO
  }
}

function extractDelaiType(args: {
  modifiedOn: number
  colonneConcernee: string
  ancienneValeur: string
  index: number
  status: LegacyModificationStatus
  nomCourrier: string
}): LegacyModificationDTO {
  const { colonneConcernee, modifiedOn, ancienneValeur, index, status, nomCourrier } = args
  if (status === 'acceptée' && !colonneConcernee) {
    throw new Error(`Colonne concernée ${index} manquante`)
  }
  const nouvelleDateLimiteAchevement = moment(colonneConcernee, 'DD/MM/YYYY').toDate().getTime()
  if (isNaN(nouvelleDateLimiteAchevement)) {
    throw new Error(`Colonne concernée ${index} contient une date invalide`)
  }
  const ancienneDateLimiteAchevement = moment(ancienneValeur, 'DD/MM/YYYY').toDate().getTime()

  if (isNaN(ancienneDateLimiteAchevement)) {
    throw new Error(`Ancienne valeur ${index} contient une date invalide`)
  }
  return {
    type: 'delai',
    modifiedOn,
    nouvelleDateLimiteAchevement,
    ancienneDateLimiteAchevement,
    modificationId: new UniqueEntityID().toString(),
    status,
    filename: nomCourrier,
  }
}

function extractActionnaireType(args: {
  modifiedOn: number
  colonneConcernee: string
  ancienneValeur: string
  index: number
  sameDateModification: LegacyModificationDTO | undefined
  nomCourrier: string
  status: LegacyModificationStatus
}): LegacyModificationDTO {
  const {
    colonneConcernee,
    modifiedOn,
    ancienneValeur,
    index,
    sameDateModification,
    nomCourrier,
    status,
  } = args
  if (colonneConcernee === 'Candidat') {
    return {
      type: 'actionnaire',
      actionnairePrecedent: ancienneValeur,
      siretPrecedent: '',
      modifiedOn,
      modificationId: new UniqueEntityID().toString(),
      filename: nomCourrier,
      status,
    }
  } else if (colonneConcernee === 'Numéro SIREN ou SIRET*') {
    return {
      ...sameDateModification,
      siretPrecedent: ancienneValeur,
      modifiedOn,
      filename: nomCourrier,
      status,
    } as LegacyModificationDTO
  } else {
    throw new Error(`Colonne concernée ${index} n'est pas reconnue`)
  }
}

function extractProducteurType(args: {
  modifiedOn: number
  colonneConcernee: string
  ancienneValeur: string
  index: number
  nomCourrier: string
  status: LegacyModificationStatus
}): LegacyModificationDTO {
  const { colonneConcernee, modifiedOn, ancienneValeur, index, nomCourrier, status } = args
  if (colonneConcernee === 'Nom (personne physique) ou raison sociale (personne morale) : ') {
    return {
      type: 'producteur',
      producteurPrecedent: ancienneValeur,
      modifiedOn,
      modificationId: new UniqueEntityID().toString(),
      filename: nomCourrier,
      status,
    }
  } else {
    throw new Error(`Colonne concernée ${index} n'est pas reconnue`)
  }
}

function extractModificationType(
  line: Record<string, string>,
  index: number,
  sameDateModification: LegacyModificationDTO | undefined
): LegacyModificationDTO {
  const {
    [`Type de modification ${index}`]: type,
    [`Colonne concernée ${index}`]: colonneConcernee,
    [`Ancienne valeur ${index}`]: ancienneValeur,
    [`Date de modification ${index}`]: dateModification,
    [`Statut demande ${index}`]: statut,
    [`Nom courrier ${index}`]: nomCourrier,
  } = line
  const modifiedOnDate = moment(dateModification, 'DD/MM/YYYY')

  if (!modifiedOnDate.isValid()) {
    throw new Error(`Date de modification ${index} n'est pas une date valide`)
  }

  if (modifiedOnDate.isAfter(moment())) {
    throw new Error(`Date de modification ${index} est une date dans le futur.`)
  }

  if (modifiedOnDate.isBefore(moment('01/01/2010', 'DD/MM/YYYY'))) {
    throw new Error(`Date de modification ${index} est une date trop loin dans le passé.`)
  }

  const modifiedOn = modifiedOnDate.toDate().getTime()

  if (['Acceptée', 'Refusée', 'Accord de principe'].indexOf(statut) === -1) {
    throw new Error(
      `Statut de la modification ${index} invalide, le statut doit correspondre à l'une de ces valeurs "Acceptée", "Refusée", ou "Accord de principe"`
    )
  }

  const status =
    statut === 'Acceptée'
      ? 'acceptée'
      : statut === 'Accord de principe'
      ? 'accord-de-principe'
      : 'rejetée'

  switch (type) {
    case 'Autre':
      return {
        type: 'autre',
        column: colonneConcernee,
        value: ancienneValeur,
        modifiedOn,
        modificationId: new UniqueEntityID().toString(),
        filename: nomCourrier,
        status,
      }
    case 'Abandon':
      return {
        type: 'abandon',
        modifiedOn,
        modificationId: new UniqueEntityID().toString(),
        filename: nomCourrier,
        status,
      }
    case 'Recours gracieux':
      return extractRecoursType({
        modifiedOn,
        sameDateModification,
        colonneConcernee,
        ancienneValeur,
        index,
        nomCourrier,
        status,
      })
    case 'Prolongation de délai':
      return extractDelaiType({
        modifiedOn,
        colonneConcernee,
        ancienneValeur,
        index,
        status,
        nomCourrier,
      })
    case "Changement d'actionnaire":
      return extractActionnaireType({
        modifiedOn,
        sameDateModification,
        colonneConcernee,
        ancienneValeur,
        index,
        nomCourrier,
        status,
      })
    case 'Changement de producteur':
      return extractProducteurType({
        modifiedOn,
        colonneConcernee,
        ancienneValeur,
        index,
        nomCourrier,
        status,
      })
    default:
      throw new Error(`Type de modification ${index} n'est pas reconnu`)
  }
}
