import { describe, expect, it } from '@jest/globals';
import { ProjectAppelOffre } from '@entities';
import { getDelaiDeRealisation } from './getDelaiDeRealisation';

describe(`fonction helper getDelaiDeRealisation`, () => {
  it(`
    Soit un appel d'offre ayant un découpage par technologie
    Lorsque la fonction est appelée sans aucune technologie mentionnée (N/A)
    Alors le délai retourné devrait être null
    `, () => {
    const appelOffre = {
      decoupageParTechnologie: true,
    } as ProjectAppelOffre;

    const résultat = getDelaiDeRealisation(appelOffre, 'N/A');

    expect(résultat).toStrictEqual(null);
  });

  it(`
    Soit un appel d'offre ayant un découpage par technologie
    Lorsque la fonction est appelée avec une technologie spécifiée
    Alors le délai retourné devrait être égal à celui mentionné dans l'appel d'offre pour la technologie choisie
  `, () => {
    const appelOffre = {
      decoupageParTechnologie: true,
      delaiRealisationEnMoisParTechnologie: {
        eolien: 36,
        pv: 30,
        hydraulique: 0,
      },
    } as ProjectAppelOffre;
    const résultat = getDelaiDeRealisation(appelOffre, 'eolien');

    expect(résultat).toStrictEqual(36);
  });

  it(`
    Soit un appel d'offre n'ayant pas un découpage par technologie
    Lorsque la fonction est appelée
    Alors le délai retourné devrait être égal au délai de réalisation en mois spécifié dans l'appel d'offre
  `, () => {
    const appelOffre = {
      decoupageParTechnologie: false,
      delaiRealisationEnMois: 18,
    } as ProjectAppelOffre;
    const résultat = getDelaiDeRealisation(appelOffre, 'N/A');

    expect(résultat).toStrictEqual(18);
  });
});
