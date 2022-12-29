import { UniqueEntityID } from '@core/domain'
import { ChangementDePuissanceDemandé } from '@modules/demandeModification'
import models from '../../../../models'
import { onChangementDePuissanceDemandé } from './onChangementDePuissanceDemandé'

describe('modificationRequest.onChangementDePuissanceDemandé', () => {
  const ModificationRequestModel = models.ModificationRequest

  const demandeId = new UniqueEntityID().toString()
  const projetId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const autorité = 'dgec'

  it('should create a Modification Request with a status of information validée', async () => {
    await onChangementDePuissanceDemandé(models)(
      new ChangementDePuissanceDemandé({
        payload: {
          demandeId,
          projetId,
          demandéPar: userId,
          puissance: 104,
          autorité,
          cahierDesCharges: 'initial',
        },
      })
    )

    const modificationRequest = await ModificationRequestModel.findByPk(demandeId)

    expect(modificationRequest).toMatchObject({
      puissance: 104,
      type: 'puissance',
      projectId: projetId,
      userId,
      status: 'information validée',
      authority: autorité,
      cahierDesCharges: 'initial',
    })
  })
})
