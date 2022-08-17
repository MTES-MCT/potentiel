import { ProjectEvent } from '..'

export type ProjectGFEvents = ProjectEvent &
  (
    | {
        type: 'ProjectGFSubmitted'
        payload: {
          file?: {
            id: string
            name: string
          }
          expirationDate?: number
        }
      }
    | {
        type: 'ProjectGFUploaded'
        payload: {
          file?: {
            id: string
            name: string
          }
          expirationDate?: number
          uploadedByRole?: string
        }
      }
    | {
        type:
          | 'ProjectGFRemoved'
          | 'ProjectGFValidated'
          | 'ProjectGFInvalidated'
          | 'ProjectGFWithdrawn'
          | 'ProjectGFDueDateSet'
        payload: null
      }
  )
