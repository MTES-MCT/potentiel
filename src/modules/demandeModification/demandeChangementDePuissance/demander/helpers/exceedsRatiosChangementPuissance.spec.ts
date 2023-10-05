import { describe, expect, it } from '@jest/globals';
import { ProjectAppelOffre } from '../../../../../entities';
import { CahierDesChargesModifié, Periode } from '@potentiel/domain-views';
import { exceedsRatiosChangementPuissance } from './exceedsRatiosChangementPuissance';

describe(`Vérifier si une nouvelle puissance dépasse un ratio déterminé`, () => {
  describe(`Quand le ratio est défini au niveau des règles du CDC modificatif de la période`, () => {
    it(`
      Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio
      Et un projet ayant ce cdc modiciatif comme cdc actuel
      Quand la nouvelle puissance est comprise dans ce ratio
      Alors la nouvelle puissance ne dépasse pas le ratio déterminé
    `, () => {
      const appelOffreRatio = {
        min: 0.9,
        max: 1.1,
      };

      const ratio = {
        min: 0.9,
        max: 1.4,
      };

      const CDCModifié = {
        type: 'modifié',
        paruLe: '30/08/2022',
      } as CahierDesChargesModifié;

      const appelOffre = {
        changementPuissance: {
          ratios: appelOffreRatio,
        },
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              ...CDCModifié,
              seuilSupplémentaireChangementPuissance: {
                ratios: ratio,
              },
            } as CahierDesChargesModifié,
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as Periode,
      } as ProjectAppelOffre;

      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: CDCModifié,
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 140,
        }),
      ).toBe(false);
    });

    it(`
      Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio
      Et un projet ayant ce cdc modiciatif comme cdc actuel
      Quand la nouvelle puissance n'est pas comprise dans ce ratio
      Alors la nouvelle puissance dépasse le ratio déterminé
    `, () => {
      const appelOffreRatio = {
        min: 0.9,
        max: 1.1,
      };

      const ratio = {
        min: 0.9,
        max: 1.4,
      };

      const CDCModifié = {
        type: 'modifié',
        paruLe: '30/08/2022',
      } as CahierDesChargesModifié;

      const appelOffre = {
        changementPuissance: {
          ratios: appelOffreRatio,
        },
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              ...CDCModifié,
              seuilSupplémentaireChangementPuissance: {
                ratios: ratio,
              },
            } as CahierDesChargesModifié,
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as Periode,
      } as ProjectAppelOffre;

      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: CDCModifié,
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 200,
        }),
      ).toBe(true);
    });

    it(`
      Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio dépendant d'une technologie
      Et un projet ayant ce cdc modiciatif comme cdc actuel
      Quand la nouvelle puissance est comprise dans ce ratio
      Alors la nouvelle puissance ne dépasse pas le ratio déterminé
    `, () => {
      const appelOffreRatio = {
        min: 0.9,
        max: 1.1,
      };

      const ratio = {
        min: 0.9,
        max: 1.4,
      };

      const CDCModifié = {
        type: 'modifié',
        paruLe: '30/08/2022',
      } as CahierDesChargesModifié;

      const appelOffre = {
        changementPuissance: {
          ratios: appelOffreRatio,
        },
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              ...CDCModifié,
              seuilSupplémentaireChangementPuissance: {
                changementByTechnologie: true,
                ratios: {
                  pv: ratio,
                },
              },
            } as CahierDesChargesModifié,
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as Periode,
      } as ProjectAppelOffre;

      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: CDCModifié,
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 90,
        }),
      ).toBe(false);
    });

    it(`
      Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio dépendant d'une technologie
      Et un projet ayant ce cdc modiciatif comme cdc actuel
      Quand la nouvelle puissance n'est pas comprise dans ce ratio
      Alors la nouvelle puissance dépasse le ratio déterminé
    `, () => {
      const appelOffreRatio = {
        min: 0.9,
        max: 1.1,
      };

      const ratio = {
        min: 0.9,
        max: 1.4,
      };

      const CDCModifié = {
        type: 'modifié',
        paruLe: '30/08/2022',
      } as CahierDesChargesModifié;

      const appelOffre = {
        changementPuissance: {
          ratios: appelOffreRatio,
        },
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              ...CDCModifié,
              seuilSupplémentaireChangementPuissance: {
                changementByTechnologie: true,
                ratios: {
                  pv: ratio,
                },
              },
            } as CahierDesChargesModifié,
          ] as ReadonlyArray<CahierDesChargesModifié>,
        } as Periode,
      } as ProjectAppelOffre;

      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: CDCModifié,
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 200,
        }),
      ).toBe(true);
    });
  });
});

// describe(`exceedsRatiosChangementPuissance`, () => {
//   describe(`when ratios are not by technology`, () => {
//     describe(`when the new puissance is between the min and max ratios of the CDC2022`);

//     const ratios = { min: 0.7, max: 1.1 };
//     const appelOffre = {
//       changementPuissance: {
//         ratios,
//       },
//     } as ProjectAppelOffre;

//     describe(`when the new puissance is between the min and max ratios of the initial puissance`, () => {
//       it(`should return false`, () => {
//         const actual = exceedsRatiosChangementPuissance({
//           project: {
//             puissanceInitiale: 100,
//             appelOffre,
//             technologie: 'pv',
//           },
//           nouvellePuissance: 80,
//         });
//         expect(actual).toBe(false);
//       });
//     });
//     describe(`when the new puissance is below the min ratio of the initial puissance`, () => {
//       it(`should return true`, () => {
//         const actual = exceedsRatiosChangementPuissance({
//           project: {
//             puissanceInitiale: 100,
//             appelOffre,
//             technologie: 'pv',
//           },
//           nouvellePuissance: 69.9,
//         });
//         expect(actual).toBe(true);
//       });
//     });
//     describe(`when the new puissance is above the max ratio of the initial puissance`, () => {
//       it(`should return true`, () => {
//         const actual = exceedsRatiosChangementPuissance({
//           project: {
//             puissanceInitiale: 100,
//             appelOffre,
//             technologie: 'pv',
//           },
//           nouvellePuissance: 110.1,
//         });
//         expect(actual).toBe(true);
//       });
//     });
//   });

// describe(`when ratios are by technology`, () => {
//   const appelOffre = {
//     changementPuissance: {
//       changementByTechnologie: true,
//       ratios: {
//         pv: { min: 0.5, max: 1.3 },
//         eolien: { min: 0.4, max: 1.4 },
//         hydraulique: { min: 0.3, max: 1.5 },
//       },
//     },
//   } as ProjectAppelOffre;

//   const technologieFixtures: Technologie[] = ['eolien', 'pv', 'hydraulique'];
//   for (const technologie of technologieFixtures) {
//     const ratios =
//       appelOffre.changementPuissance.changementByTechnologie &&
//       appelOffre.changementPuissance.ratios[technologie];

//     describe(`when the new puissance is between the ${technologie} min and max ratios of the initial puissance`, () => {
//       it(`should return false`, () => {
//         expect(ratios).toBeDefined();

//         const puissanceInitiale = 100;
//         const nouvellePuissance = puissanceInitiale * (ratios!.min + 0.1);

//         const actual = exceedsRatiosChangementPuissance({
//           project: {
//             puissanceInitiale,
//             appelOffre,
//             technologie,
//           },
//           nouvellePuissance,
//         });
//         expect(actual).toBe(false);
//       });
//     });
//     describe(`when the new puissance is below the ${technologie} min ratio of the initial puissance`, () => {
//       it(`should return true`, () => {
//         expect(ratios).toBeDefined();

//         const puissanceInitiale = 100;
//         const nouvellePuissance = puissanceInitiale * (ratios!.min - 0.1);

//         const actual = exceedsRatiosChangementPuissance({
//           project: {
//             puissanceInitiale,
//             appelOffre,
//             technologie,
//           },
//           nouvellePuissance,
//         });
//         expect(actual).toBe(true);
//       });
//     });
//     describe(`when the new puissance is above the ${technologie} max ratio of the initial puissance`, () => {
//       it(`should return true`, () => {
//         expect(ratios).toBeDefined();

//         const puissanceInitiale = 100;
//         const nouvellePuissance = puissanceInitiale * (ratios!.max + 0.1);

//         const actual = exceedsRatiosChangementPuissance({
//           project: {
//             puissanceInitiale,
//             appelOffre,
//             technologie,
//           },
//           nouvellePuissance,
//         });
//         expect(actual).toBe(true);
//       });
//     });
//   }

//   describe(`when the technology is unknown`, () => {
//     describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
//       it(`should return false`, () => {
//         const actual = exceedsRatiosChangementPuissance({
//           project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
//           nouvellePuissance: 105,
//         });
//         expect(actual).toBe(false);
//       });
//     });
//     describe(`when the new puissance is below 90% of the initial one`, () => {
//       it(`should return true`, () => {
//         const actual = exceedsRatiosChangementPuissance({
//           project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
//           nouvellePuissance: 89.9,
//         });
//         expect(actual).toBe(true);
//       });
//     });
//     describe(`when the new puissance is above 110% of the initial one`, () => {
//       it(`should return true`, () => {
//         const actual = exceedsRatiosChangementPuissance({
//           project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
//           nouvellePuissance: 110.1,
//         });
//         expect(actual).toBe(true);
//       });
//     });
//   });
// });

// describe(`when appel offre is undefined`, () => {
//   describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
//     it(`should return false`, () => {
//       const actual = exceedsRatiosChangementPuissance({
//         project: { puissanceInitiale: 100, technologie: 'pv' },
//         nouvellePuissance: 105,
//       });
//       expect(actual).toBe(false);
//     });
//   });
//   describe(`when the new puissance is below 90% of the initial one`, () => {
//     it(`should return true`, () => {
//       const actual = exceedsRatiosChangementPuissance({
//         project: { puissanceInitiale: 100, technologie: 'pv' },
//         nouvellePuissance: 89.9,
//       });
//       expect(actual).toBe(true);
//     });
//   });
//   describe(`when the new puissance is above 110% of the initial one`, () => {
//     it(`should return true`, () => {
//       const actual = exceedsRatiosChangementPuissance({
//         project: { puissanceInitiale: 100, technologie: 'pv' },
//         nouvellePuissance: 110.1,
//       });
//       expect(actual).toBe(true);
//     });
//   });
// });
// });
