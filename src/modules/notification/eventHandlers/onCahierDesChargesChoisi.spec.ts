import { Some } from '../../../types'
import { CahierDesChargesChoisi } from '../../project'
import { onCahierDesChargesChoisi } from './onCahierDesChargesChoisi'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeProject } from '@entities'

describe('Notifier le choix du nouveau cahier des charges', () => {
  describe(`Lorsqu'un nouveau cahier des charges est choisi pour un projet`, () => {
    const projetId = 'le-projet'
    const choisiPar = 'le-porteur-de-projet'
    const sendNotification = jest.fn()
    const findProjectById = () =>
      Promise.resolve(
        makeProject(makeFakeProject({ id: projetId, nomProjet: 'nomProjet' })).unwrap()
      )
    const findUserById = () =>
      Promise.resolve(Some(makeFakeUser({ email: 'porteur@test.test', fullName: 'john doe' })))

    beforeEach(() => {
      sendNotification.mockClear()
    })

    it(`Si le cahier des charges est de type modifié
         Alors le porteur qui l'a choisi devrait être notifié avec le template 'pp-cdc-modifié-choisi'`, async () => {
      await onCahierDesChargesChoisi({
        findProjectById,
        findUserById,
        sendNotification,
      })(
        new CahierDesChargesChoisi({
          payload: {
            projetId,
            choisiPar,
            type: 'modifié',
            paruLe: '30/07/2021',
            alternatif: true,
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pp-cdc-modifié-choisi',
          message: expect.objectContaining({
            email: 'porteur@test.test',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nomProjet',
            cdc_date: '30/07/2021',
            cdc_alternatif: 'alternatif ',
            projet_url: expect.stringContaining(projetId),
          }),
        })
      )
    })

    it(`Si le cahier des charges est de type initial
        Alors le porteur qui l'a choisi devrait être notifié avec le template 'pp-cdc-initial-choisi`, async () => {
      await onCahierDesChargesChoisi({
        findProjectById,
        findUserById,
        sendNotification,
      })(
        new CahierDesChargesChoisi({
          payload: {
            projetId,
            choisiPar,
            type: 'initial',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pp-cdc-initial-choisi',
          message: expect.objectContaining({
            email: 'porteur@test.test',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nomProjet',
            projet_url: expect.stringContaining(projetId),
          }),
        })
      )
    })
  })
})
