import { ProjectEvent } from '..'

export type DemandeAbandonSignaledEvent = ProjectEvent & {
  type: 'DemandeAbandonSignaled'
  payload: {
    signaledBy: string
    status: 'acceptée' | 'rejetée'
    attachment?: { id: string; name: string }
    notes?: string
  }
}
