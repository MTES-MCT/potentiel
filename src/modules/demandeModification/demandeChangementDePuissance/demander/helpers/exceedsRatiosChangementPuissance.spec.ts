import { describe, expect, it } from '@jest/globals';
import { ProjectAppelOffre } from '../../../../../entities';
import { CahierDesChargesModifié, Periode, Technologie } from '@potentiel-domain/appel-offre';
import { exceedsRatiosChangementPuissance } from './exceedsRatiosChangementPuissance';

describe(`exceedsRatiosChangementPuissance`, () => {
  describe(`when ratios are not by technology`, () => {
    const ratios = { min: 0.7, max: 1.1 };
    const appelOffre = {
      changementPuissance: {
        ratios,
      },
    } as ProjectAppelOffre;

    describe(`when the new puissance is between the min and max ratios of the initial puissance`, () => {
      it(`should return false`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: {
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
            cahierDesCharges: { type: 'initial' },
          },
          nouvellePuissance: 80,
        });
        expect(actual).toBe(false);
      });
    });
    describe(`when the new puissance is below the min ratio of the initial puissance`, () => {
      it(`should return true`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: {
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
            cahierDesCharges: { type: 'initial' },
          },
          nouvellePuissance: 69.9,
        });
        expect(actual).toBe(true);
      });
    });
    describe(`when the new puissance is above the max ratio of the initial puissance`, () => {
      it(`should return true`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: {
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
            cahierDesCharges: { type: 'initial' },
          },
          nouvellePuissance: 110.1,
        });
        expect(actual).toBe(true);
      });
    });
  });

  describe(`when ratios are by technology`, () => {
    const appelOffre = {
      changementPuissance: {
        changementByTechnologie: true,
        ratios: {
          pv: { min: 0.5, max: 1.3 },
          eolien: { min: 0.4, max: 1.4 },
          hydraulique: { min: 0.3, max: 1.5 },
        },
      },
    } as ProjectAppelOffre;

    const technologieFixtures: Technologie[] = ['eolien', 'pv', 'hydraulique'];
    for (const technologie of technologieFixtures) {
      const ratios =
        appelOffre.changementPuissance.changementByTechnologie &&
        appelOffre.changementPuissance.ratios[technologie];

      describe(`when the new puissance is between the ${technologie} min and max ratios of the initial puissance`, () => {
        it(`should return false`, () => {
          expect(ratios).toBeDefined();

          const puissanceInitiale = 100;
          const nouvellePuissance = puissanceInitiale * (ratios!.min + 0.1);

          const actual = exceedsRatiosChangementPuissance({
            project: {
              puissanceInitiale,
              appelOffre,
              technologie,
              cahierDesCharges: { type: 'initial' },
            },
            nouvellePuissance,
          });
          expect(actual).toBe(false);
        });
      });
      describe(`when the new puissance is below the ${technologie} min ratio of the initial puissance`, () => {
        it(`should return true`, () => {
          expect(ratios).toBeDefined();

          const puissanceInitiale = 100;
          const nouvellePuissance = puissanceInitiale * (ratios!.min - 0.1);

          const actual = exceedsRatiosChangementPuissance({
            project: {
              puissanceInitiale,
              appelOffre,
              technologie,
              cahierDesCharges: { type: 'initial' },
            },
            nouvellePuissance,
          });
          expect(actual).toBe(true);
        });
      });
      describe(`when the new puissance is above the ${technologie} max ratio of the initial puissance`, () => {
        it(`should return true`, () => {
          expect(ratios).toBeDefined();

          const puissanceInitiale = 100;
          const nouvellePuissance = puissanceInitiale * (ratios!.max + 0.1);

          const actual = exceedsRatiosChangementPuissance({
            project: {
              puissanceInitiale,
              appelOffre,
              technologie,
              cahierDesCharges: { type: 'initial' },
            },
            nouvellePuissance,
          });
          expect(actual).toBe(true);
        });
      });
    }

    describe(`when the technology is unknown`, () => {
      describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
        it(`should return false`, () => {
          const actual = exceedsRatiosChangementPuissance({
            project: {
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'N/A',
              cahierDesCharges: { type: 'initial' },
            },
            nouvellePuissance: 105,
          });
          expect(actual).toBe(false);
        });
      });
      describe(`when the new puissance is below 90% of the initial one`, () => {
        it(`should return true`, () => {
          const actual = exceedsRatiosChangementPuissance({
            project: {
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'N/A',
              cahierDesCharges: { type: 'initial' },
            },
            nouvellePuissance: 89.9,
          });
          expect(actual).toBe(true);
        });
      });
      describe(`when the new puissance is above 110% of the initial one`, () => {
        it(`should return true`, () => {
          const actual = exceedsRatiosChangementPuissance({
            project: {
              puissanceInitiale: 100,
              appelOffre,
              technologie: 'N/A',
              cahierDesCharges: { type: 'initial' },
            },
            nouvellePuissance: 110.1,
          });
          expect(actual).toBe(true);
        });
      });
    });
  });

  describe(`when appel offre is undefined`, () => {
    describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: {
            puissanceInitiale: 100,
            technologie: 'pv',
            cahierDesCharges: { type: 'initial' },
          },
          nouvellePuissance: 105,
        });
        expect(actual).toBe(false);
      });
    });
    describe(`when the new puissance is below 90% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: {
            puissanceInitiale: 100,
            technologie: 'pv',
            cahierDesCharges: { type: 'initial' },
          },
          nouvellePuissance: 89.9,
        });
        expect(actual).toBe(true);
      });
    });
    describe(`when the new puissance is above 110% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = exceedsRatiosChangementPuissance({
          project: {
            puissanceInitiale: 100,
            technologie: 'pv',
            cahierDesCharges: { type: 'initial' },
          },
          nouvellePuissance: 110.1,
        });
        expect(actual).toBe(true);
      });
    });
  });

  describe(`Contexte du cahier des charges du 30/08/2022`, () => {
    it(`Étant donné un projet avec le cahier des charges du 30/08/2022
        Et dont le cahier des charges présente des seuils spécifiques pour les changements de puissance avec un max à 140%
        Lorsqu'un changement de puissance intervient pour un ratio supérieur au ratio du CDC initial, mais inférieur au ratio max du CDC du projet
        Alors la demande ne devrait pas être considérée comme dépassant le ratio de son CDC`, () => {
      const appelOffre = {
        changementPuissance: {
          ratios: { min: 0.7, max: 1.1 },
        },
        periode: {
          type: 'notified',
          certificateTemplate: 'ppe2.v2',
          noteThreshold: 10,
          cahierDesCharges: { référence: '', url: '' },
          delaiDcrEnMois: { texte: '', valeur: 1 },
          id: '',
          title: '',
          cahiersDesChargesModifiésDisponibles: [
            {
              type: 'modifié',
              paruLe: '30/08/2022',
              seuilSupplémentaireChangementPuissance: { ratios: { min: 0.7, max: 1.4 } },
            } as CahierDesChargesModifié,
          ],
        } as Periode,
      } as ProjectAppelOffre;

      const actual = exceedsRatiosChangementPuissance({
        project: {
          puissanceInitiale: 100,
          appelOffre,
          cahierDesCharges: { paruLe: '30/08/2022', type: 'modifié' },
          technologie: 'pv',
        },
        nouvellePuissance: 135,
      });
      expect(actual).toBe(false);
    });
  });
});
