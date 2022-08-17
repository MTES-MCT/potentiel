import { ProjectEvent } from '..'

export type DemandeSignaledEvents = ProjectEvent &
  (
    | {
        type: 'DemandeDelaiSignaled'
        payload: {
          signaledBy: string
          attachment?: { id: string; name: string }
          notes?: string
        } & (
          | {
              status: 'rejetée' | 'accord-de-principe'
            }
          | {
              status: 'acceptée'
              oldCompletionDueOn?: number
              newCompletionDueOn: number
            }
        )
      }
    | {
        type: 'DemandeAbandonSignaled' | 'DemandeRecoursSignaled'
        payload: {
          signaledBy: string
          status: 'acceptée' | 'rejetée'
          attachment?: { id: string; name: string }
          notes?: string
        }
      }
  )
