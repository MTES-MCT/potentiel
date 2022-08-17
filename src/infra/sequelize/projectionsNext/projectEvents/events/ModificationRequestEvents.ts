import { Fournisseur } from '@modules/project'
import { ProjectEvent } from '..'

export type ModificationRequestEvents = ProjectEvent &
  (
    | {
        type: 'ModificationRequested'
        payload: {
          modificationRequestId: string
          authority: 'dgec' | 'dreal'
        } & (
          | {
              modificationType: 'abandon' | 'recours'
            }
          | {
              modificationType: 'delai'
              delayInMonths: number
            }
          | {
              modificationType: 'puissance'
              puissance: number
            }
        )
      }
    | {
        type: 'ModificationRequestAccepted'
        payload: {
          modificationRequestId: string
          file: {
            id: string
            name: string
          }
          delayInMonthsGranted?: number
        }
      }
    | {
        type: 'ModificationRequestRejected' | 'ConfirmationRequested'
        payload: {
          modificationRequestId: string
          file?: {
            id: string
            name: string
          }
        }
      }
    | {
        type:
          | 'ModificationRequestCancelled'
          | 'ModificationRequestInstructionStarted'
          | 'ModificationRequestConfirmed'
        payload: {
          modificationRequestId: string
        }
      }
    | {
        type: 'ModificationReceived'
        payload: {
          modificationRequestId: string
        } & (
          | {
              modificationType: 'producteur'
              producteur: string
            }
          | {
              modificationType: 'actionnaire'
              actionnaire: string
            }
          | {
              modificationType: 'fournisseur'
              fournisseurs: Fournisseur[]
            }
          | {
              modificationType: 'puissance'
              puissance: number
            }
        )
      }
    | {
        type: 'LegacyModificationImported'
        payload: {
          status: 'acceptée' | 'rejetée' | 'accord-de-principe'
          modificationRequestId: string
          filename: string
        } & (
          | {
              modificationType: 'abandon'
            }
          | {
              modificationType: 'actionnaire'
              actionnairePrecedent: string
            }
          | {
              modificationType: 'autre'
              column: string
              value: string
            }
          | {
              modificationType: 'delai'
              ancienneDateLimiteAchevement: number
              nouvelleDateLimiteAchevement: number
            }
          | {
              modificationType: 'recours'
              motifElimination: string
            }
        )
      }
  )
