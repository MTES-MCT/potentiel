import { User } from '@entities'
import { Permission } from '@modules/authN'

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user: User & { accountUrl: string; permissions: Array<Permission> }
    kauth: any
  }
}

declare module 'express-session' {
  type RésultatSoumissionFormulaire =
    | {
        type: 'succès'
        message: string
      }
    | {
        type: 'échec'
        raison: string
        erreursDeValidationCsv?: Array<{
          numéroLigne?: number
          valeurInvalide?: string
          raison: string
        }>
        erreursDeValidation?: Record<string, string>
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
