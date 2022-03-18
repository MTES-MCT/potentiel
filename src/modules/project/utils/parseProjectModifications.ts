import { LegacyModificationDTO } from '../../modificationRequest'
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
}): LegacyModificationDTO {
  const { colonneConcernee, modifiedOn, ancienneValeur, index, sameDateModification } = args
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

    const accepted = ancienneValeur === 'Classé'
    return {
      type: 'recours',
      projectId: '',
      modifiedOn,
      accepted,
      motifElimination: '',
      modificationId: new UniqueEntityID().toString(),
    } as LegacyModificationDTO
  } else {
    return {
      ...sameDateModification,
      motifElimination: ancienneValeur,
    } as LegacyModificationDTO
  }
}

function extractDelaiType(args: {
  modifiedOn: number
  colonneConcernee: string
  ancienneValeur: string
  index: number
  statut: string
}): LegacyModificationDTO {
  const { colonneConcernee, modifiedOn, ancienneValeur, index, statut } = args
  const nouvelleDateLimiteAchevement = moment(colonneConcernee, 'DD/MM/YYYY').toDate().getTime()
  if (isNaN(nouvelleDateLimiteAchevement)) {
    throw new Error(`Colonne concernée ${index} contient une date invalide`)
  }
  const ancienneDateLimiteAchevement = moment(ancienneValeur, 'DD/MM/YYYY').toDate().getTime()

  if (isNaN(ancienneDateLimiteAchevement)) {
    throw new Error(`Ancienne valeur ${index} contient une date invalide`)
  }
  const accepted = statut === 'Acceptée'
  return {
    type: 'delai',
    modifiedOn,
    nouvelleDateLimiteAchevement,
    ancienneDateLimiteAchevement,
    modificationId: new UniqueEntityID().toString(),
    accepted,
  }
}

function extractActionnaireType(args: {
  modifiedOn: number
  colonneConcernee: string
  ancienneValeur: string
  index: number
  sameDateModification: LegacyModificationDTO | undefined
}): LegacyModificationDTO {
  const { colonneConcernee, modifiedOn, ancienneValeur, index, sameDateModification } = args
  if (colonneConcernee === 'Candidat') {
    return {
      type: 'actionnaire',
      actionnairePrecedent: ancienneValeur,
      siretPrecedent: '',
      modifiedOn,
      modificationId: new UniqueEntityID().toString(),
    }
  } else if (colonneConcernee === 'Numéro SIREN ou SIRET*') {
    return {
      ...sameDateModification,
      siretPrecedent: ancienneValeur,
      modifiedOn,
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
}): LegacyModificationDTO {
  const { colonneConcernee, modifiedOn, ancienneValeur, index } = args
  if (colonneConcernee === 'Nom (personne physique) ou raison sociale (personne morale) : ') {
    return {
      type: 'producteur',
      producteurPrecedent: ancienneValeur,
      modifiedOn,
      modificationId: new UniqueEntityID().toString(),
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
    [`Statut demandes ${index}`]: statut,
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

  if (['Acceptée', 'Refusée', 'Accord de principe'].indexOf(statut) === -1) {
    throw new Error(
      `Statut de la modification ${index} invalide, le statut doit correspondre à l'une de ces valeurs "Acceptée", "Refusée", ou "Accord de principe"`
    )
  }

  const modifiedOn = modifiedOnDate.toDate().getTime()

  switch (type) {
    case 'Autre':
      return {
        type: 'autre',
        column: colonneConcernee,
        value: ancienneValeur,
        modifiedOn,
        modificationId: new UniqueEntityID().toString(),
      }
    case 'Abandon':
      const accepted = statut === 'Acceptée'
      return {
        type: 'abandon',
        modifiedOn,
        modificationId: new UniqueEntityID().toString(),
        accepted,
      }
    case 'Recours gracieux':
      return extractRecoursType({
        modifiedOn,
        sameDateModification,
        colonneConcernee,
        ancienneValeur,
        index,
      })
    case 'Prolongation de délai':
      return extractDelaiType({
        modifiedOn,
        colonneConcernee,
        ancienneValeur,
        index,
        statut,
      })
    case "Changement d'actionnaire":
      return extractActionnaireType({
        modifiedOn,
        sameDateModification,
        colonneConcernee,
        ancienneValeur,
        index,
      })
    case 'Changement de producteur':
      return extractProducteurType({
        modifiedOn,
        colonneConcernee,
        ancienneValeur,
        index,
      })
    default:
      throw new Error(`Type de modification ${index} n'est pas reconnu`)
  }
}
