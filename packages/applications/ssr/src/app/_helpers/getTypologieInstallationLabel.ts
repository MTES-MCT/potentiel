import type { Candidature } from '@potentiel-domain/projet';

const typologieToLabelMap: Record<
  Candidature.TypologieInstallation.ValueType['typologie'],
  string
> = {
  'agrivoltaïque.culture': 'Installation agrivoltaïque (culture)',
  'agrivoltaïque.jachère-plus-de-5-ans': 'Installation agrivoltaïque (jachère de plus de 5 ans)',
  'agrivoltaïque.serre': 'Installation agrivoltaïque (serre)',
  'agrivoltaïque.élevage': 'Installation agrivoltaïque (élevage)',
  'agrivoltaïque.non-précisé': 'Installation agrivoltaïque (non précisé)',
  'bâtiment.existant-avec-rénovation-de-toiture': 'Bâtiment existant avec rénovation de toiture',
  'bâtiment.existant-sans-rénovation-de-toiture': 'Bâtiment existant sans rénovation de toiture',
  'bâtiment.neuf': 'Bâtiment neuf',
  'bâtiment.mixte': 'Bâtiment mixte',
  'bâtiment.serre': 'Bâtiment (serre)',
  'bâtiment.stabulation': 'Bâtiment (stabulation)',
  'ombrière.parking': 'Ombrière (parking)',
  'ombrière.mixte': 'Ombrière (mixte)',
  'ombrière.autre': 'Ombrière',
  'ombrière.agrivoltaïque': 'Ombrière agrivoltaïque',
  sol: 'Installation au sol',
  'bâtiment.non-précisé': 'Bâtiment (non précisé)',
  'ombrière.agrivoltaïque-pré-aper': 'Ombrière agrivoltaïque (pré-APER)',
  'ombrière.agrivoltaïque-post-aper': 'Ombrière agrivoltaïque (post-APER)',
  'bâtiment.serre-agrivoltaïque-post-aper': 'Bâtiment (serre agrivoltaïque post-APER)',
  'bâtiment.serre-agrivoltaïque-pré-aper': 'Bâtiment (serre agrivoltaïque pré-APER)',
};

export const getTypologieInstallationLabel = (
  typologie: Candidature.TypologieInstallation.ValueType['typologie'],
) => typologieToLabelMap[typologie];
