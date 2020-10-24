import { SystemError, Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { relanceGarantiesFinancieres } from '../useCases'

const postRelanceGarantiesFinancieres = async (request: HttpRequest) => {
  try {
    const result = await relanceGarantiesFinancieres()
    return result.match({
      ok: () => Success('Relance envoyées avec succès'),
      err: (e: Error) => {
        console.log('postRelanceGarantiesFinancieres failed', e)
        return SystemError(`Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`)
      },
    })
  } catch (error) {
    return SystemError(`Les relances n'ont pas pu être envoyées. (Erreur: ${error.message})`)
  }
}
export { postRelanceGarantiesFinancieres }
