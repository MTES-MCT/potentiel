import { ListingEnedisImporté } from '../../modules/enedis'
import { eventStore } from '../eventStore.config'
import { importEnedisData } from '../useCases.config'

eventStore.subscribe(ListingEnedisImporté.type, importEnedisData)

console.log('Enedis Event Handlers Initialized')
export const EnedisHandlersOk = true
