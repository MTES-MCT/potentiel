import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

export const getTypologieDuProjetLabel = (
  typologie: Candidature.TypologieDuProjet.ValueType['typologie'],
) => {
  return match(typologie)
    .with('agrivoltaïque.culture', () => 'Installation agrivoltaïque (culture)')
    .with(
      'agrivoltaïque.jachère-plus-de-5-ans',
      () => 'Installation agrivoltaïque (jachère de plus de 5 ans)',
    )
    .with('agrivoltaïque.serre', () => 'Installation agrivoltaïque (serre)')
    .with('agrivoltaïque.élevage', () => 'Installation agrivoltaïque (élevage)')
    .with(
      'bâtiment.existant-avec-rénovation-de-toiture',
      () => 'Bâtiment existant avec rénovation de toiture',
    )
    .with(
      'bâtiment.existant-sans-rénovation-de-toiture',
      () => 'Bâtiment existant sans rénovation de toiture',
    )
    .with('bâtiment.neuf', () => 'Bâtiment neuf')
    .with('bâtiment.serre', () => 'Bâtiment (serre)')
    .with('bâtiment.stabulation', () => 'Bâtiment (stabulation)')
    .with('ombrière.parking', () => 'Ombrière (parking)')
    .with('ombrière.mixte', () => 'Ombrière (mixte)')
    .with('ombrière.autre', () => 'Ombrière')
    .exhaustive();
};
