import { EDFFileUploaded } from '../../modules/edf'
import { eventStore } from '../eventStore.config'
import { importEdfData } from '../useCases.config'

eventStore.subscribe(EDFFileUploaded.type, importEdfData)

console.log('EDF Event Handlers Initialized')
export const EDFHandlersOk = true
