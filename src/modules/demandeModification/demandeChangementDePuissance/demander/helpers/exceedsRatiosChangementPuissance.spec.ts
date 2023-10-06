import { describe, expect, it } from '@jest/globals';
import { ProjectAppelOffre } from '../../../../../entities';
import { CahierDesChargesModifié, Periode } from '@potentiel/domain-views';
import { exceedsRatiosChangementPuissance } from './exceedsRatiosChangementPuissance';

describe(`Vérifier si une nouvelle puissance dépasse un ratio déterminé`, () => {
  describe(`Quand le ratio est défini au niveau des règles du CDC modificatif de la période`, () => {
    describe(`Ratio classique`, () => {
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

        const ratios = {
          min: 0.9,
          max: 1.4,
        };

        const appelOffre = {
          changementPuissance: {
            ratios: appelOffreRatio,
          },
          periode: {
            cahiersDesChargesModifiésDisponibles: [
              {
                type: 'modifié',
                paruLe: '30/08/2022',
                seuilSupplémentaireChangementPuissance: {
                  ratios,
                },
              } as CahierDesChargesModifié,
            ] as ReadonlyArray<CahierDesChargesModifié>,
          } as Periode,
        } as ProjectAppelOffre;

        expect(
          exceedsRatiosChangementPuissance({
            project: {
              cahierDesChargesActuel: '30/08/2022',
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
        Quand la nouvelle puissance est inférieure au ratio
        Alors la nouvelle puissance dépasse le ratio déterminé
      `, () => {
        const appelOffreRatio = {
          min: 0.9,
          max: 1.1,
        };

        const ratios = {
          min: 0.9,
          max: 1.4,
        };

        const appelOffre = {
          changementPuissance: {
            ratios: appelOffreRatio,
          },
          periode: {
            cahiersDesChargesModifiésDisponibles: [
              {
                type: 'modifié',
                paruLe: '30/08/2022',
                seuilSupplémentaireChangementPuissance: {
                  ratios,
                },
              } as CahierDesChargesModifié,
            ] as ReadonlyArray<CahierDesChargesModifié>,
          } as Periode,
        } as ProjectAppelOffre;

        expect(
          exceedsRatiosChangementPuissance({
            project: {
              cahierDesChargesActuel: '30/08/2022',
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'pv',
            },
            nouvellePuissance: 50,
          }),
        ).toBe(true);
      });

      it(`
        Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio
        Et un projet ayant ce cdc modiciatif comme cdc actuel
        Quand la nouvelle puissance est supérieure au ratio
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

        const appelOffre = {
          changementPuissance: {
            ratios: appelOffreRatio,
          },
          periode: {
            cahiersDesChargesModifiésDisponibles: [
              {
                type: 'modifié',
                paruLe: '30/08/2022',
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
              cahierDesChargesActuel: '30/08/2022',
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'pv',
            },
            nouvellePuissance: 200,
          }),
        ).toBe(true);
      });
    });

    describe(`Ratio défini par technologie`, () => {
      describe(`Technologie connue`, () => {
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

          const ratios = {
            pv: {
              min: 0.9,
              max: 1.4,
            },
          };

          const appelOffre = {
            changementPuissance: {
              ratios: appelOffreRatio,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  seuilSupplémentaireChangementPuissance: {
                    changementByTechnologie: true,
                    ratios,
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as Periode,
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: '30/08/2022',
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
          Quand la nouvelle puissance est inférieure au ratio
          Alors la nouvelle puissance dépasse le ratio déterminé
        `, () => {
          const appelOffreRatio = {
            min: 0.9,
            max: 1.1,
          };

          const ratios = {
            pv: {
              min: 0.9,
              max: 1.4,
            },
          };

          const appelOffre = {
            changementPuissance: {
              ratios: appelOffreRatio,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  seuilSupplémentaireChangementPuissance: {
                    changementByTechnologie: true,
                    ratios,
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as Periode,
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: '30/08/2022',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 50,
            }),
          ).toBe(true);
        });

        it(`
          Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio dépendant d'une technologie
          Et un projet ayant ce cdc modiciatif comme cdc actuel
          Quand la nouvelle puissance est inférieure au ratio
          Alors la nouvelle puissance dépasse le ratio déterminé
        `, () => {
          const appelOffreRatio = {
            min: 0.9,
            max: 1.1,
          };

          const ratios = {
            pv: {
              min: 0.9,
              max: 1.4,
            },
          };

          const appelOffre = {
            changementPuissance: {
              ratios: appelOffreRatio,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  seuilSupplémentaireChangementPuissance: {
                    changementByTechnologie: true,
                    ratios,
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as Periode,
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: '30/08/2022',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 200,
            }),
          ).toBe(true);
        });
      });

      describe(`Technologie inconnue`, () => {
        it(`
          Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio dépendant d'une technologie
          Et un projet ayant ce cdc modiciatif comme cdc actuel
          Quand la technologie est inconnue
          Et que la nouvelle puissance est comprise dans le ratio par défaut
          Alors la nouvelle puissance ne dépasse pas le ratio déterminé
        `, () => {
          const appelOffreRatio = {
            min: 0.9,
            max: 1.1,
          };

          const ratios = {
            pv: {
              min: 0.9,
              max: 1.4,
            },
          };

          const appelOffre = {
            changementPuissance: {
              ratios: appelOffreRatio,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  seuilSupplémentaireChangementPuissance: {
                    changementByTechnologie: true,
                    ratios,
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as Periode,
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: '30/08/2022',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'N/A',
              },
              nouvellePuissance: 90,
            }),
          ).toBe(false);
        });

        it(`
          Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio dépendant d'une technologie
          Et un projet ayant ce cdc modiciatif comme cdc actuel
          Quand la technologie est inconnue
          Et que la nouvelle puissance est inférieure au ratio par défaut
          Alors la nouvelle puissance dépasse le ratio déterminé
        `, () => {
          const appelOffreRatio = {
            min: 0.9,
            max: 1.1,
          };

          const ratios = {
            pv: {
              min: 0.9,
              max: 1.4,
            },
          };

          const appelOffre = {
            changementPuissance: {
              ratios: appelOffreRatio,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  seuilSupplémentaireChangementPuissance: {
                    changementByTechnologie: true,
                    ratios,
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as Periode,
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: '30/08/2022',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'N/A',
              },
              nouvellePuissance: 50,
            }),
          ).toBe(true);
        });

        it(`
          Étant donné un appel d'offre qui comporte une période ayant un cdc modificatif qui détermine un ratio dépendant d'une technologie
          Et un projet ayant ce cdc modiciatif comme cdc actuel
          Quand la technologie est inconnue
          Et que la nouvelle puissance est supérieure au ratio par défaut
          Alors la nouvelle puissance dépasse le ratio déterminé
        `, () => {
          const appelOffreRatio = {
            min: 0.9,
            max: 1.1,
          };

          const ratios = {
            pv: {
              min: 0.9,
              max: 1.4,
            },
          };

          const appelOffre = {
            changementPuissance: {
              ratios: appelOffreRatio,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                  seuilSupplémentaireChangementPuissance: {
                    changementByTechnologie: true,
                    ratios,
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            } as Periode,
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: '30/08/2022',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'N/A',
              },
              nouvellePuissance: 120,
            }),
          ).toBe(true);
        });
      });
    });
  });

  describe(`Quand le ratio est défini au niveau des règles de l'appel d'offre`, () => {
    describe(`Ratio classique`, () => {
      it(`
        Étant donné un appel d'offre qui détermine un ratio
        Quand la nouvelle puissance est comprise dans ce ratio
        Alors la nouvelle puissance ne dépasse pas le ratio déterminé`, () => {
        const ratios = {
          min: 0.9,
          max: 1.1,
        };

        const appelOffre = {
          changementPuissance: {
            ratios,
          },
          periode: {
            cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
          },
        } as ProjectAppelOffre;

        expect(
          exceedsRatiosChangementPuissance({
            project: {
              cahierDesChargesActuel: 'initial',
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'pv',
            },
            nouvellePuissance: 110,
          }),
        ).toBe(false);
      });

      it(`
        Étant donné un appel d'offre qui détermine un ratio
        Quand la nouvelle puissance est inférieure au ratio
        Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
        const ratios = {
          min: 0.9,
          max: 1.1,
        };

        const appelOffre = {
          changementPuissance: {
            ratios,
          },
          periode: {
            cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
          },
        } as ProjectAppelOffre;

        expect(
          exceedsRatiosChangementPuissance({
            project: {
              cahierDesChargesActuel: 'initial',
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'pv',
            },
            nouvellePuissance: 50,
          }),
        ).toBe(true);
      });

      it(`
        Étant donné un appel d'offre qui détermine un ratio
        Quand la nouvelle puissance est supérieure au ratio
        Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
        const ratios = {
          min: 0.9,
          max: 1.1,
        };

        const appelOffre = {
          changementPuissance: {
            ratios,
          },
          periode: {
            cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
          },
        } as ProjectAppelOffre;

        expect(
          exceedsRatiosChangementPuissance({
            project: {
              cahierDesChargesActuel: 'initial',
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'pv',
            },
            nouvellePuissance: 200,
          }),
        ).toBe(true);
      });
    });

    describe(`Ratio défini par technologie`, () => {
      describe(`Technologie connue`, () => {
        it(`
          Étant donné un appel d'offre qui détermine un ratio dépendant d'une technologie
          Quand la nouvelle puissance est comprise dans ce ratio
          Alors la nouvelle puissance ne dépasse pas le ratio déterminé`, () => {
          const ratios = {
            pv: {
              min: 0.9,
              max: 1.1,
            },
          };

          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: 'initial',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 110,
            }),
          ).toBe(false);
        });

        it(`
          Étant donné un appel d'offre qui détermine un ratio dépendant d'une technologie
          Quand la nouvelle puissance est inférieure au ratio
          Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
          const ratios = {
            pv: {
              min: 0.9,
              max: 1.1,
            },
          };

          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: 'initial',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 50,
            }),
          ).toBe(true);
        });

        it(`
          Étant donné un appel d'offre qui détermine un ratio dépendant d'une technologie
          Quand la nouvelle puissance est supérieure au ratio
          Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
          const ratios = {
            pv: {
              min: 0.9,
              max: 1.1,
            },
          };

          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: 'initial',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance: 200,
            }),
          ).toBe(true);
        });
      });

      describe(`Technologie inconnue`, () => {
        it(`
          Étant donné un appel d'offre qui détermine un ratio dépendant d'une technologie
          Quand la technologie est inconnue
          Et que la nouvelle puissance est comprise dans le ratio par défaut
          Alors la nouvelle puissance ne dépasse pas le ratio déterminé`, () => {
          const ratios = {
            pv: {
              min: 0.9,
              max: 1.1,
            },
          };

          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: 'initial',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'N/A',
              },
              nouvellePuissance: 110,
            }),
          ).toBe(false);
        });

        it(`
          Étant donné un appel d'offre qui détermine un ratio dépendant d'une technologie
          Quand la technologie est inconnue
          Et que la nouvelle puissance est inférieure au ratio par défaut
          Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
          const ratios = {
            pv: {
              min: 0.9,
              max: 1.1,
            },
          };

          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: 'initial',
                puissanceInitiale: 100,
                appelOffre,
                technologie: 'N/A',
              },
              nouvellePuissance: 50,
            }),
          ).toBe(true);
        });

        it(`
          Étant donné un appel d'offre qui détermine un ratio dépendant d'une technologie
          Quand la technologie est inconnue
          Et que la nouvelle puissance est supérieure au ratio par défaut
          Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
          const ratios = {
            pv: {
              min: 0.9,
              max: 1.1,
            },
          };

          const appelOffre = {
            changementPuissance: {
              changementByTechnologie: true,
              ratios,
            },
            periode: {
              cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre;

          expect(
            exceedsRatiosChangementPuissance({
              project: {
                cahierDesChargesActuel: 'initial',
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
  });

  describe(`Quand l'appel d'offre n'existe pas`, () => {
    it(`
        ÉÉtant donné un appel d'offre inexistant
        Quand la nouvelle puissance est comprise dans le ratio par défaut
        Alors la nouvelle puissance ne dépasse pas le ratio déterminé`, () => {
      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: 'initial',
            puissanceInitiale: 100,
            technologie: 'pv',
          },
          nouvellePuissance: 110,
        }),
      ).toBe(false);
    });

    it(`
        ÉÉtant donné un appel d'offre inexistant
        Quand la nouvelle puissance est inférieure au ratio par défaut
        Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: 'initial',
            puissanceInitiale: 100,
            technologie: 'pv',
          },
          nouvellePuissance: 50,
        }),
      ).toBe(true);
    });

    it(`
        ÉÉtant donné un appel d'offre inexistant
        Quand la nouvelle puissance est supérieure au ratio par défaut
        Alors la nouvelle puissance dépasse le ratio déterminé`, () => {
      expect(
        exceedsRatiosChangementPuissance({
          project: {
            cahierDesChargesActuel: 'initial',
            puissanceInitiale: 100,
            technologie: 'pv',
          },
          nouvellePuissance: 200,
        }),
      ).toBe(true);
    });
  });
});
