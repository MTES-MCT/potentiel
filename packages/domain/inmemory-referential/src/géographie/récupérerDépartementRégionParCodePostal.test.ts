import { describe, test } from 'node:test';

import { expect } from 'chai';

import { récupérerDépartementRégionParCodePostal } from './récupérerDépartementRégionParCodePostal.js';

describe('récupérerDépartementRégionParCodePostal', () => {
  const corseDuSud = { département: 'Corse-du-Sud', région: 'Corse' };
  const hauteCorse = { département: 'Haute-Corse', région: 'Corse' };

  describe('Cas particuliers Corse', () => {
    test('retourne Corse-du-Sud / Corse pour 20000, 20090, 20167 (Ajaccio)', () => {
      expect(récupérerDépartementRégionParCodePostal('20000')).to.deep.eq(corseDuSud);
      expect(récupérerDépartementRégionParCodePostal('20090')).to.deep.eq(corseDuSud);
      expect(récupérerDépartementRégionParCodePostal('20167')).to.deep.eq(corseDuSud);
    });

    test('retourne Corse-du-Sud / Corse pour 20146 (Sotta)', () => {
      const result = récupérerDépartementRégionParCodePostal('20146');

      expect(result).not.to.be.undefined;
      if (!result) return;
      expect(result.département).to.eq('Corse-du-Sud');
      expect(result.région).to.eq('Corse');
    });

    test('retourne Haute-Corse / Corse pour 20243 (Prunelli-di-Fiumorbo)', () => {
      const result = récupérerDépartementRégionParCodePostal('20243');

      expect(result).not.to.be.undefined;
      if (!result) return;
      expect(result.département).to.eq('Haute-Corse');
      expect(result.région).to.eq('Corse');
    });

    test('retourne Haute-Corse / Corse pour 20200, 20600 (Bastia, Furiani)', () => {
      expect(récupérerDépartementRégionParCodePostal('20200')).to.deep.eq(hauteCorse);
      expect(récupérerDépartementRégionParCodePostal('20600')).to.deep.eq(hauteCorse);
    });

    test('retourne Haute-Corse / Corse pour 20620 (Biguglia)', () => {
      expect(récupérerDépartementRégionParCodePostal('20620')).to.deep.eq(hauteCorse);
    });

    test('retourne Rhône / Auvergne-Rhône-Alpes pour 69250', () => {
      const result = récupérerDépartementRégionParCodePostal('69250');

      expect(result).not.to.be.undefined;
      if (!result) return;
      expect(result.département).to.eq('Rhône');
      expect(result.région).to.eq('Auvergne-Rhône-Alpes');
    });

    test('retourne La Réunion / La Réunion pour 97438 (Sainte-Marie)', () => {
      const result = récupérerDépartementRégionParCodePostal('97438');

      expect(result).not.to.be.undefined;
      if (!result) return;
      expect(result.département).to.eq('La Réunion');
      expect(result.région).to.eq('La Réunion');
    });
  });

  test('erreur si le CP ne fait pas 5 caractères', () => {
    const résultat = récupérerDépartementRégionParCodePostal('8230');
    expect(résultat).to.be.undefined;
  });
});
