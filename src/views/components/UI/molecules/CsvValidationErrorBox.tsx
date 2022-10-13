import React, { FC } from 'react'
import { CsvValidationErrorType } from '../../../../controllers/helpers/errors'

type ValidationErrorBoxProps = {
  validationErreurs: CsvValidationErrorType
}

export const CsvValidationErrorBox: FC<ValidationErrorBoxProps> = ({ validationErreurs }) => (
  <ul className="notification error">
    {validationErreurs.map(({ numéroLigne, valeur, erreur }, index) => (
      <li key={index} className="ml-3">
        {numéroLigne && `Ligne ${numéroLigne.toString()} - `}
        {valeur && `${valeur} - `}
        {erreur && `${erreur}`}
      </li>
    ))}
  </ul>
)
