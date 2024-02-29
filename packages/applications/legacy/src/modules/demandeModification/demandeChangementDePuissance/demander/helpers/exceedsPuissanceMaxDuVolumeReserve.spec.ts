import { describe, expect, it } from '@jest/globals';
import { ProjectAppelOffre } from '../../../../../entities';
import { Periode } from '@potentiel-domain/appel-offre';
import { exceedsPuissanceMaxDuVolumeReserve } from './exceedsPuissanceMaxDuVolumeReserve';

describe('exceedsPuissanceMaxDuVolumeReserve', () => {
  describe(`Étant donné une période d'appel d'offres avec un volume réservé
      pour les projets : 
        - dont la puissance n'excède pas 10
        - dont la note du dernier retenu est de 15`, () => {
    const appelOffre = {
      periode: {
        noteThresholdBy: 'category',
        noteThreshold: { volumeReserve: { puissanceMax: 10, noteThreshold: 15 } },
      } as Periode,
    } as ProjectAppelOffre;

    describe(`Projet entrant dans le volume réservé`, () => {
      it(`Étant donné un projet avec une puissance initiale de 9 et une note de 16
          Lorsque la nouvelle puissance demandée dépasse 10 (puissance max du volume)
          Alors la demande doit être considérée comme dépassant la puissance max du volume réservé`, () => {
        const actual = exceedsPuissanceMaxDuVolumeReserve({
          project: { appelOffre, désignationCatégorie: 'volume-réservé' },
          nouvellePuissance: 10.1,
        });
        expect(actual).toBe(true);
      });

      it(`Étant donné un projet avec une puissance initiale de 9 et une note de 16
          Lorsque la nouvelle puissance demandée ne dépasse pas 10 (puissance max du volume)
          Alors la demande ne doit pas être considérée comme dépassant la puissance max du volume réservé`, () => {
        const actual = exceedsPuissanceMaxDuVolumeReserve({
          project: { appelOffre, désignationCatégorie: 'volume-réservé' },
          nouvellePuissance: 9.1,
        });
        expect(actual).toBe(false);
      });
    });

    describe(`Projet hors volume réservé`, () => {
      it(`Étant donné un projet avec une puissance initiale supérieure à celle du volume réservé
          Lorsque la nouvelle puissance demandée dépasse 10 (puissance max du volume)
          Alors la demande ne doit pas être considérée comme dépassant la puissance max du volume réservé`, () => {
        const actual = exceedsPuissanceMaxDuVolumeReserve({
          project: { appelOffre, désignationCatégorie: 'hors-volume-réservé' },
          nouvellePuissance: 10.1,
        });
        expect(actual).toBe(false);
      });

      it(`Étant donné un projet avec une note inférieure à celle du dernier retenu du volume réservé
          Lorsque la nouvelle puissance demandée dépasse 10 (puissance max du volume)
          Alors la demande ne doit pas être considérée comme dépassant la puissance max du volume réservé`, () => {
        const actual = exceedsPuissanceMaxDuVolumeReserve({
          project: { appelOffre, désignationCatégorie: 'hors-volume-réservé' },
          nouvellePuissance: 10.1,
        });
        expect(actual).toBe(false);
      });
    });
  });

  describe(`Étant donné une période d'appel d'offres sans volume réservé`, () => {
    const appelOffre = {
      periode: {} as Periode,
    } as ProjectAppelOffre;
    it(`Étant donné un projet
        Lorsque qu'il y a une demande de changement de puissance
        Alors la demande ne devrait pas être considérée comme dépassant un volume réservé`, () => {
      const actual = exceedsPuissanceMaxDuVolumeReserve({
        project: { appelOffre },
        nouvellePuissance: 10.1,
      });
      expect(actual).toBe(false);
    });
  });
});
