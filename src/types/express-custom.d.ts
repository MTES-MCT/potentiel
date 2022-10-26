import { User } from '@entities'

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user: User & { accountUrl: string }
    kauth: any
  }
}

declare module 'express-session' {
  type RésultatSoumissionFormulaire =
    | {
        type: 'succès'
      }
    | {
        type: 'échec'
        raison: string
        erreursDeValidationCsv?: Array<{
          numéroLigne?: number
          valeurInvalide?: string
          raison: string
        }>
      }

  interface SessionData {
    forms?: Record<
      string,
      | {
          résultatSoumissionFormulaire?: RésultatSoumissionFormulaire
        }
      | undefined
    >
  }
}
