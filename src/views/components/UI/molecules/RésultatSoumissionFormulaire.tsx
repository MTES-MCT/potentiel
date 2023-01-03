import React, { FC } from 'react'
import { ErrorBox, SuccessBox } from '@components'

export type RésultatSoumissionFormulaireProps = {
  résultatSoumissionFormulaire:
    | {
        type: 'succès'
        message: string
      }
    | {
        type: 'échec'
        raison: string
        erreursDeValidationCsv?: Array<ErreurValidationCsv>
        erreursDeValidation?: Record<string, string>
      }
}

export const RésultatSoumissionFormulaire: FC<RésultatSoumissionFormulaireProps> = ({
  résultatSoumissionFormulaire,
}) => {
  switch (résultatSoumissionFormulaire.type) {
    case 'succès':
      return <SuccessBox title={résultatSoumissionFormulaire.message} />
    case 'échec':
      return résultatSoumissionFormulaire.erreursDeValidationCsv &&
        résultatSoumissionFormulaire.erreursDeValidationCsv?.length > 0 ? (
        <CsvValidationErrorBox
          erreursDeValidationCsv={résultatSoumissionFormulaire.erreursDeValidationCsv}
        />
      ) : (
        <ErrorBox title={résultatSoumissionFormulaire.raison} />
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
