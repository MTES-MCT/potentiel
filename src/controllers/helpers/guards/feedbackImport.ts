export type CsvValidationErrorType = {
  numéroLigne: number
  valeur?: string
  erreur: string
}

type SuccessFeedback = {
  success: string
}

type ErrorFeedback = {
  error: string
}

export type CsvValidationErrorFeedback = {
  validationErreurs: CsvValidationErrorType[]
}

export type Feedback = SuccessFeedback | ErrorFeedback | CsvValidationErrorFeedback
