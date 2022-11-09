import { TâcheMiseAJourDonnéesDeRaccordementDémarrée } from '../events'
import { makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée } from './onTâcheMiseAJourDonnéesDeRaccordementDémarrée'

describe(`Éxécution de la mise à jour des données de raccordement`, () => {
  it(`Lorsqu'un évènement TâcheMiseAJourDonnéesDeRaccordementDémarrée survient
      Alors la mise à jour des données de raccordement devrait être éxécutée`, async () => {
    const mettreAJourDonnéesDeRaccordement = jest.fn()

    const onTâcheMiseAJourDonnéesDeRaccordementDémarrée =
      makeOnTâcheMiseAJourDonnéesDeRaccordementDémarrée({
        mettreAJourDonnéesDeRaccordement,
      })

    await onTâcheMiseAJourDonnéesDeRaccordementDémarrée(
      new TâcheMiseAJourDonnéesDeRaccordementDémarrée({
        payload: {
          misAJourPar: 'utilisateur1',
          gestionnaire: 'Enedis',
          dates: [{ identifiantGestionnaireRéseau: 'gr01', dateMiseEnService: '01/01/2022' }],
        },
      })
    )

    expect(mettreAJourDonnéesDeRaccordement).toHaveBeenCalledWith(
      expect.objectContaining({
        gestionnaire: 'Enedis',
        données: [
          { identifiantGestionnaireRéseau: 'gr01', dateMiseEnService: new Date('01/01/2022') },
        ],
      })
    )
  })
})
