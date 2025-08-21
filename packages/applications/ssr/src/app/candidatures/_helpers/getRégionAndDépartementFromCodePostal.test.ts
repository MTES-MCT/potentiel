import { describe, test } from 'node:test';

import { expect } from 'chai';

import { getRégionAndDépartementFromCodePostal } from './getRégionAndDépartementFromCodePostal';

describe('getRégionAndDépartementFromCodePostal helper', () => {
  const corseDuSud = { département: 'Corse-du-Sud', région: 'Corse' };
  const hauteCorse = { département: 'Haute-Corse', région: 'Corse' };

  test('should return Corse-du-Sud / Corse for 20000, 20090, 20167 (Ajaccio)', () => {
    expect(getRégionAndDépartementFromCodePostal('20000')).to.deep.eq(corseDuSud);
    expect(getRégionAndDépartementFromCodePostal('20090')).to.deep.eq(corseDuSud);
    expect(getRégionAndDépartementFromCodePostal('20167')).to.deep.eq(corseDuSud);
  });

  test('should return Corse-du-Sud / Corse for 20146 (Sotta)', () => {
    const result = getRégionAndDépartementFromCodePostal('20146');

    expect(result).not.to.be.undefined;
    if (!result) return;
    expect(result.département).to.eq('Corse-du-Sud');
    expect(result.région).to.eq('Corse');
  });

  test('should return Haute-Corse / Corse for 20243 (Prunelli-di-Fiumorbo)', () => {
    const result = getRégionAndDépartementFromCodePostal('20243');

    expect(result).not.to.be.undefined;
    if (!result) return;
    expect(result.département).to.eq('Haute-Corse');
    expect(result.région).to.eq('Corse');
  });

  test('should return Haute-Corse / Corse for 20200, 20600 (Bastia, Furiani)', () => {
    expect(getRégionAndDépartementFromCodePostal('20200')).to.deep.eq(hauteCorse);
    expect(getRégionAndDépartementFromCodePostal('20600')).to.deep.eq(hauteCorse);
  });

  test('should return Haute-Corse / Corse for 20620 (Biguglia)', () => {
    expect(getRégionAndDépartementFromCodePostal('20620')).to.deep.eq(hauteCorse);
  });

  test('should return Rhône / Auvergne-Rhône-Alpes for 69250', () => {
    const result = getRégionAndDépartementFromCodePostal('69250');

    expect(result).not.to.be.undefined;
    if (!result) return;
    expect(result.département).to.eq('Rhône');
    expect(result.région).to.eq('Auvergne-Rhône-Alpes');
  });

  test('should return La Réunion / La Réunion for 97438 (Sainte-Marie)', () => {
    const result = getRégionAndDépartementFromCodePostal('97438');

    expect(result).not.to.be.undefined;
    if (!result) return;
    expect(result.département).to.eq('La Réunion');
    expect(result.région).to.eq('La Réunion');
  });
});
