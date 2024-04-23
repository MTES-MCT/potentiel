import { describe, expect, it } from '@jest/globals';
import { ProjectAppelOffre } from '../../../../../entities';
import { Periode } from '@potentiel-domain/appel-offre';
import { exceedsPuissanceMaxFamille } from './exceedsPuissanceMaxFamille';

describe('Vérifier si une nouvelle puissance dépasse la puissance de la famille du projet', () => {
  it(`Etant donné un projet sans famille
      Alors le retour est "faux"`, () => {
    const appelOffre = {
      periode: {
        noteThreshold: 50,
      } as Periode,
    } as ProjectAppelOffre;
    const actual = exceedsPuissanceMaxFamille({
      project: { appelOffre },
      nouvellePuissance: 150,
    });
    expect(actual).toBe(false);
  });

  it(`Etant donné un projet avec famille sans puissance max
      Alors le retour est "faux"`, () => {
    const appelOffre = {
      periode: {
        noteThresholdBy: 'family',
        noteThreshold: [{ familleId: '1', noteThreshold: 22.59 }],
        familles: [{ soumisAuxGarantiesFinancieres: 'non soumis', id: '1' }],
      } as Periode,
    } as ProjectAppelOffre;
    const actual = exceedsPuissanceMaxFamille({
      project: { appelOffre, familleId: '1' },
      nouvellePuissance: 150,
    });
    expect(actual).toBe(false);
  });

  it(`Etant donné un projet avec famille ayant une puissance max
      Si la nouvelle puissance n'excède pas cette puissance max
      Alors le retour est "faux"`, () => {
    const appelOffre = {
      periode: {
        noteThresholdBy: 'family',
        noteThreshold: [{ familleId: '1', noteThreshold: 22.59 }],
        familles: [{ soumisAuxGarantiesFinancieres: 'non soumis', id: '1', puissanceMax: 200 }],
      } as Periode,
    } as ProjectAppelOffre;
    const actual = exceedsPuissanceMaxFamille({
      project: { appelOffre, familleId: '1' },
      nouvellePuissance: 150,
    });
    expect(actual).toBe(false);
  });

  it(`Etant donné un projet avec famille ayant une puissance max
      Si la nouvelle puissance excède cette puissance max
      Alors le retour est "vrai"`, () => {
    const appelOffre = {
      periode: {
        noteThresholdBy: 'family',
        noteThreshold: [{ familleId: '1', noteThreshold: 22.59 }],
        familles: [{ soumisAuxGarantiesFinancieres: 'non soumis', id: '1', puissanceMax: 200 }],
      } as Periode,
    } as ProjectAppelOffre;
    const actual = exceedsPuissanceMaxFamille({
      project: { appelOffre, familleId: '1' },
      nouvellePuissance: 300,
    });
    expect(actual).toBe(true);
  });

  it(`Etant donné un projet avec famille non référencée dans la période
      Alors le retour est "false"`, () => {
    const appelOffre = {
      periode: {
        noteThresholdBy: 'family',
        noteThreshold: [{ familleId: '1', noteThreshold: 22.59 }],
        familles: [{ soumisAuxGarantiesFinancieres: 'non soumis', id: '1', puissanceMax: 200 }],
      } as Periode,
    } as ProjectAppelOffre;
    const actual = exceedsPuissanceMaxFamille({
      project: { appelOffre, familleId: '2' }, // famille inconnue
      nouvellePuissance: 300,
    });
    expect(actual).toBe(false);
  });
});
