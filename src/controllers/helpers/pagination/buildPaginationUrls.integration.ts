import { buildPaginationUrls } from './buildPaginationUrls';

describe(`construire les urls de pagination`, () => {
  it(`
    Étant donné une url sans params page
    Lorsqu'on construit les urls de pagination
    Alors les urls des pages précédente et suivante devrait être undefined
  `, () => {
    const pageActuelleUrl = 'http://locahost:3000/projets.html';
    const url = new URL(pageActuelleUrl);
    expect(
      buildPaginationUrls({
        url,
        pageCount: 10,
      }),
    ).toEqual({
      pagePrécédenteUrl: undefined,
      pageActuelleUrl,
      pageSuivanteUrl: undefined,
    });
  });
  it(`
    Étant donné une url avec comme params page 0
    Lorsqu'on construit les urls de pagination
    Alors l'url de la page précédente devrait être undefined
  `, () => {
    const pageActuelleUrl = 'http://locahost:3000/projets.html?page=0';
    const url = new URL(pageActuelleUrl);
    expect(
      buildPaginationUrls({
        url,
        pageCount: 10,
      }),
    ).toEqual({
      pagePrécédenteUrl: undefined,
      pageActuelleUrl,
      pageSuivanteUrl: 'http://locahost:3000/projets.html?page=1',
    });
  });
  it(`
    Étant donné une url avec comme params page 10
    Lorsqu'on construit les urls de pagination avec une limite de page à 10
    Alors l'url de la page suivante devrait être undefined
  `, () => {
    const pageActuelleUrl = 'http://locahost:3000/projets.html?page=10';
    const url = new URL(pageActuelleUrl);
    expect(
      buildPaginationUrls({
        url,
        pageCount: 10,
      }),
    ).toEqual({
      pagePrécédenteUrl: 'http://locahost:3000/projets.html?page=9',
      pageActuelleUrl,
      pageSuivanteUrl: undefined,
    });
  });
  it(`
    Étant donné une url avec comme params page 5
    Lorsqu'on construit les urls de pagination avec une limite de page à 10
    Alors toutes les urls devraient être fonctionnelles 
  `, () => {
    const pageActuelleUrl = 'http://locahost:3000/projets.html?page=5';
    const url = new URL(pageActuelleUrl);
    expect(
      buildPaginationUrls({
        url,
        pageCount: 10,
      }),
    ).toEqual({
      pagePrécédenteUrl: 'http://locahost:3000/projets.html?page=4',
      pageActuelleUrl,
      pageSuivanteUrl: 'http://locahost:3000/projets.html?page=6',
    });
  });
});
