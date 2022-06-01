import { ListingEDFImporté } from '../../modules/edf'
import { eventStore } from '../eventStore.config'
import { importEdfData } from '../useCases.config'

eventStore.subscribe(ListingEDFImporté.type, importEdfData)

console.log('EDF Event Handlers Initialized')
export const EDFHandlersOk = true
