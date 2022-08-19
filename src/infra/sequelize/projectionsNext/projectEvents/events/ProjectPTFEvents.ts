import { ProjectEvent } from '..'

export type ProjectPTFEvents = ProjectEvent &
  (
    | {
        type: 'ProjectPTFSubmitted'
        payload: {
          file?: {
            id: string
            name: string
          }
        }
      }
    | {
        type: 'ProjectPTFRemoved'
        payload: null
      }
  )
