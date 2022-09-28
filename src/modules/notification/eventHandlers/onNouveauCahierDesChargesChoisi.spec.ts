import { Some } from '../../../types'
import { NouveauCahierDesChargesChoisi } from '../../project'
import { onNouveauCahierDesChargesChoisi } from './onNouveauCahierDesChargesChoisi'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeProject } from '@entities'

describe('Notifier le choix du nouveau cahier des charges', () => {
  it(`Lorsque le nouveau cahier des charges est choisi pour un projet
      Alors le porteur qui l'a choisi devrait être notifié`, async () => {
    const projetId = 'le-projet'
    const choisiPar = 'le-porteur-de-projet'

    const sendNotification = jest.fn()
    const findProjectById = () =>
      Promise.resolve(
        makeProject(makeFakeProject({ id: projetId, nomProjet: 'nomProjet' })).unwrap()
      )
    const findUserById = () =>
      Promise.resolve(Some(makeFakeUser({ email: 'porteur@test.test', fullName: 'john doe' })))

    sendNotification.mockClear()

    await onNouveauCahierDesChargesChoisi({
      findProjectById,
      findUserById,
      sendNotification,
    })(
      new NouveauCahierDesChargesChoisi({
        payload: {
          projetId,
          choisiPar,
          paruLe: '30/07/2021',
          alternatif: true,
        },
      })
    )

    expect(sendNotification).toHaveBeenCalledTimes(1)
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pp-nouveau-cdc-choisi',
        message: expect.objectContaining({
          email: 'porteur@test.test',
        }),
        variables: expect.objectContaining({
          nom_projet: 'nomProjet',
          cdc_date: '30/07/2021',
          cdc_alternatif: 'alternatif ',
          projet_url: expect.stringContaining('le-projet'),
        }),
      })
    )
  })
})
