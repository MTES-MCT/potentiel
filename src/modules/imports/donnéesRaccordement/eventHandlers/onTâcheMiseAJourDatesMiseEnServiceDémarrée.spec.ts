import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '../events'
import { makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée } from './onTâcheMiseAJourDatesMiseEnServiceDémarrée'

describe(`Éxécution du use-case mettreÀJourDateMiseEnService`, () => {
  it(`Lorsqu'un évènement TâcheMiseAJourDatesMiseEnServiceDémarrée survient
      Alors le use case mettreAJourDatesMiseEnService devrait être éxécuté`, async () => {
    const mettreAJourDatesMiseEnService = jest.fn()

    const onTâcheMiseAJourDatesMiseEnServiceDémarrée =
      makeOnTâcheMiseAJourDatesMiseEnServiceDémarrée({
        mettreAJourDatesMiseEnService,
      })

    await onTâcheMiseAJourDatesMiseEnServiceDémarrée(
      new TâcheMiseAJourDatesMiseEnServiceDémarrée({
        payload: {
          misAJourPar: 'utilisateur1',
          gestionnaire: 'Enedis',
          dates: [{ identifiantGestionnaireRéseau: 'gr01', dateMiseEnService: '01/01/2022' }],
        },
      })
    )

    expect(mettreAJourDatesMiseEnService).toHaveBeenCalledWith(
      expect.objectContaining({
        gestionnaire: 'Enedis',
        données: [
          { identifiantGestionnaireRéseau: 'gr01', dateMiseEnService: new Date('01/01/2022') },
        ],
      })
    )
  })
})
