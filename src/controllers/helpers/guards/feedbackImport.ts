export type CsvValidationError = {
  numéroLigne?: number
  valeur?: string
  erreur?: string
}

type SuccessFeedback = {
  success: string
}

type ErrorFeedback = {
  error: string
}

export type CsvValidationErrorFeedback = {
  validationErreurs: CsvValidationError[]
}

export type Feedback = SuccessFeedback | ErrorFeedback | CsvValidationErrorFeedback

export const isErrorFeedback = (message: Feedback): message is ErrorFeedback => {
  return (message as ErrorFeedback).error !== undefined
}
export const isSuccessFeedback = (message: Feedback): message is SuccessFeedback => {
  return (message as SuccessFeedback).success !== undefined
}

export const isCsvValidationErrorFeedback = (
  messages: Feedback
): messages is CsvValidationErrorFeedback =>
  (messages as CsvValidationErrorFeedback).validationErreurs !== undefined
