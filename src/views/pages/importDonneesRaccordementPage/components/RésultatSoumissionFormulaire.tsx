import React, { FC } from 'react'
import { SuccessErrorBox } from '@components'

export type RésultatSoumissionFormulaireProps = {
  résultatSoumissionFormulaire:
    | {
        type: 'succès'
      }
    | {
        type: 'échec'
        raison: string
        erreursDeValidationCsv?: Array<ErreurValidationCsv>
      }
}

export const RésultatSoumissionFormulaire: FC<RésultatSoumissionFormulaireProps> = ({
  résultatSoumissionFormulaire,
}) => {
  switch (résultatSoumissionFormulaire.type) {
    case 'succès':
      return (
        <SuccessErrorBox success="L'import du fichier a démarré. Actualisez la page pour afficher son état." />
      )
    case 'échec':
      return résultatSoumissionFormulaire.erreursDeValidationCsv &&
        résultatSoumissionFormulaire.erreursDeValidationCsv?.length > 0 ? (
        <CsvValidationErrorBox
          erreursDeValidationCsv={résultatSoumissionFormulaire.erreursDeValidationCsv}
        />
      ) : (
        <SuccessErrorBox error={résultatSoumissionFormulaire.raison} />
      )
  }
}

type ErreurValidationCsv = {
  numéroLigne?: number
  valeurInvalide?: string
  raison: string
}

type CsvValidationErrorBoxProps = {
  erreursDeValidationCsv: Array<ErreurValidationCsv>
}

const CsvValidationErrorBox: FC<CsvValidationErrorBoxProps> = ({ erreursDeValidationCsv }) => {
  const afficherErreur = ({ numéroLigne, valeurInvalide, raison }: ErreurValidationCsv) => {
    return `${numéroLigne ? `Ligne ${numéroLigne.toString()} - ` : ''}${
      valeurInvalide ? `${valeurInvalide} - ` : ''
    }${raison}`
  }

  if (erreursDeValidationCsv.length === 1) {
    return <div className="notification error">{afficherErreur(erreursDeValidationCsv[0])}</div>
  }

  return (
    <ul className="notification error">
      {erreursDeValidationCsv.map((erreur, index) => (
        <li key={index} className="ml-3">
          {afficherErreur(erreur)}
        </li>
      ))}
    </ul>
  )
}
