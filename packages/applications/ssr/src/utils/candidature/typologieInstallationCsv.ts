// import { Candidature, Lauréat } from '@potentiel-domain/projet';

// Colonnes du CSV qui nous intéressent :

// 'Eléments sous l’ombrière' ->> elementSousOmbrière ->> {typologie: 'ombrière.autre', détails: elementSousOmbrière}
// 'Typologie de bâtiment' ->> typologieBâtiment ->> {typologie: typologieBâtiment}
// 'Installations agrivoltaïques' ->> installationAgrivoltaïque ->> {typologie: installationAgrivoltaïque}

// Valeurs possibles pour bâtiment et agri :
// const typologiesBâtiment: Record<
//   string,
//   Candidature.Dépôt.RawType['typologieInstallation'][number]['typologie']
// > = {
//   'Bâtiment existant avec rénovation de toiture': 'bâtiment.existant-avec-rénovation-de-toiture',
//   'Bâtiment existant sans rénovation de toiture': 'bâtiment.existant-sans-rénovation-de-toiture',
//   mixte: 'bâtiment.mixte',
//   'bâtiment neuf': 'bâtiment.neuf',
// };
// const typologiesAgrivoltaïque: Record<
//   string,
//   Candidature.Dépôt.RawType['typologieInstallation'][number]['typologie']
// > = {
//   culture: 'agrivoltaique.culture',
//   'jachère de plus de 5 ans': 'agrivoltaique.jachère-plus-de-5-ans',
//   élevage: 'agrivoltaique.élevage',
//   serre: 'agrivoltaique.serre',
// };

// EXEMPLE
// Entrée :

// {
//   'Eléments sous l’ombrière': 'XXX',
//   'Typologie de bâtiment': 'Bâtiment existant avec rénovation de toiture',
//   'Installations agrivoltaïques': ''Jachère de plus de 5 ans''
// }

// Sortie attendue :

// const sortie: Candidature.Dépôt.RawType['typologieInstallation'] = [
//   { typologie: 'ombrière.autre', détails: 'XXX' },
//   { typologie: 'bâtiment.existant-avec-rénovation-de-toiture' },
//   { typologie: 'agrivoltaique.jachère-plus-de-5-ans' },
// ];
