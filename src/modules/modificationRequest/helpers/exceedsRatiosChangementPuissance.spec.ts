import { ProjectAppelOffre, Technologie } from '@entities'
import { exceedsRatiosChangementPuissance } from './exceedsRatiosChangementPuissance'

describe(`Méthode exceedsRatiosChangementPuissance`, () => {
  describe(`Lorsque l'appel d'offre n'existe pas, on se base sur le ratio par défaut (min: 90%, max: 110%)`, () => {
    describe(`Lorsque la nouvelle puissance est dans l'interval par défaut`, () => {
      it('Alors la fonction devrait retourner false', () => {
        const actual = exceedsRatiosChangementPuissance({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 105,
        })
        expect(actual).toBe(false)
      })
    })
    describe(`Lorsque la nouvelle puissance est inférieure au minimum par défaut`, () => {
      it(`Alors la fonction devrait retourner true`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 89.9,
        })
        expect(actual).toBe(true)
      })
    })
    describe(`Lorsque la nouvelle puisance est supérieure au maximum par défaut`, () => {
      it('Alors la fonction devrait retourner true', () => {
        const actual = exceedsRatiosChangementPuissance({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 110.1,
        })
        expect(actual).toBe(true)
      })
    })
  })

  describe(`Lorsque l'appel d'offre existe`, () => {
    describe(`Lorsque l'appel d'offre n'a pas de cahier des charges modifiés disponible, alors on se base sur le ratio défini dans l'appel d'offre`, () => {
      describe(`Lorsque le ratio n'est pas par technologie `, () => {
        const ratios = { min: 0.7, max: 1.1 }
        const appelOffre = {
          changementPuissance: {
            ratios,
          },
        } as ProjectAppelOffre

        describe(`Quand la nouvelle puissance est entre le minimum et le maxiumum de la puissance initiale`, () => {
          it(`Alors la nouvelle puissance n'a pas dépassée le ratio de la puissance initiale et la fonction devrait retourner false`, () => {
            const actual = exceedsRatiosChangementPuissance({
              project: {
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 80,
            })
            expect(actual).toBe(false)
          })
        })
        describe(`Quand la nouvelle puissance est inférieure au minimum de la puissance initiale`, () => {
          it(`Alors la nouvelle puissance a dépassée le ratio de la puissance initiale et la fonction devrait retourner true`, () => {
            const actual = exceedsRatiosChangementPuissance({
              project: {
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 69.9,
            })
            expect(actual).toBe(true)
          })
        })
        describe(`Quand la nouvelle puissance est supérieure au maximum de la puissance initiale`, () => {
          it(`Alors la nouvelle puissance a dépassée le ratio de la puissance initiale et la fonction devrait retourner true`, () => {
            const actual = exceedsRatiosChangementPuissance({
              project: {
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 110.1,
            })
            expect(actual).toBe(true)
          })
        })
      })

      describe(`Lorsque le ratio est par technologie`, () => {
        describe(`Lorsque la technologie est inconnue, on se base sur le ratio par défaut (min: 90%, max: 110%)`, () => {
          describe(`Lorsque la nouvelle puissance est dans l'interval par défaut`, () => {
            it('Alors la fonction devrait retourner false', () => {
              const actual = exceedsRatiosChangementPuissance({
                project: { puissanceInitiale: 100, technologie: 'N/A' },
                nouvellePuissance: 105,
              })
              expect(actual).toBe(false)
            })
          })
          describe(`Lorsque la nouvelle puissance est inférieure au minimum par défaut`, () => {
            it(`Alors la fonction devrait retourner true`, () => {
              const actual = exceedsRatiosChangementPuissance({
                project: { puissanceInitiale: 100, technologie: 'N/A' },
                nouvellePuissance: 89.9,
              })
              expect(actual).toBe(true)
            })
          })
          describe(`Lorsque la nouvelle puisance est supérieure au maximum par défaut`, () => {
            it('Alors la fonction devrait retourner true', () => {
              const actual = exceedsRatiosChangementPuissance({
                project: { puissanceInitiale: 100, technologie: 'N/A' },
                nouvellePuissance: 110.1,
              })
              expect(actual).toBe(true)
            })
          })
        })

        describe(`Lorsque la technologie est connue, on se base sur son ration`, () => {
          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios: {
                pv: { min: 0.5, max: 1.3 },
                eolien: { min: 0.4, max: 1.4 },
                hydraulique: { min: 0.3, max: 1.5 },
              },
            },
          } as ProjectAppelOffre

          const technologieFixtures: Technologie[] = ['eolien', 'pv', 'hydraulique']
          for (const technologie of technologieFixtures) {
            const ratios =
              appelOffre.changementPuissance.changementByTechnologie &&
              appelOffre.changementPuissance.ratios[technologie]

            describe(`Lorsque la nouvelle puissance est comprise entre le minimum et le maximum du ratio de ${technologie}`, () => {
              it(`Alors la nouvelle puissance n'a pas dépassée le ratio de la puissance initiale et la fonction devrait retourner false`, () => {
                expect(ratios).toBeDefined()

                const puissanceInitiale = 100
                const nouvellePuissance = puissanceInitiale * (ratios!.min + 0.1)

                const actual = exceedsRatiosChangementPuissance({
                  project: {
                    puissanceInitiale,
                    appelOffre,
                    technologie,
                  },
                  nouvellePuissance,
                })
                expect(actual).toBe(false)
              })
            })
            describe(`Lorsque la nouvelle puissance est inférieure au minimum du ratio de ${technologie}`, () => {
              it(`Alors la nouvelle puissance a dépassée le ratio de la puissance initiale et la fonction devrait retourner true`, () => {
                expect(ratios).toBeDefined()

                const puissanceInitiale = 100
                const nouvellePuissance = puissanceInitiale * (ratios!.min - 0.1)

                const actual = exceedsRatiosChangementPuissance({
                  project: {
                    puissanceInitiale,
                    appelOffre,
                    technologie,
                  },
                  nouvellePuissance,
                })
                expect(actual).toBe(true)
              })
            })
            describe(`Lorsque la nouvelle puissance est supérieure au maximum du ratio de ${technologie}`, () => {
              it(`Alors la nouvelle puissance a dépassée le ratio de la puissance initiale et la fonction devrait retourner true`, () => {
                expect(ratios).toBeDefined()

                const puissanceInitiale = 100
                const nouvellePuissance = puissanceInitiale * (ratios!.max + 0.1)

                const actual = exceedsRatiosChangementPuissance({
                  project: {
                    puissanceInitiale,
                    appelOffre,
                    technologie,
                  },
                  nouvellePuissance,
                })
                expect(actual).toBe(true)
              })
            })
          }
        })
      })
    })
  })
})
