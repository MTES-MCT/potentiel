export type DépartementRégion = {
  région: string;
  département: string;
};
export type DépartementRégionCP = DépartementRégion & {
  codePostal: string;
};

export const récupérerDépartementRégionParCodePostal = (
  codePostal: string,
): DépartementRégionCP | undefined => {
  if (codePostal.length > 5) {
    return undefined;
  }
  if (codePostal.length < 5) {
    codePostal = codePostal.padStart(5, '0');
  }

  const régionDépartement =
    référentiel[codePostal] ?? // traiter les exceptions
    référentiel[codePostal.slice(0, 3)] ?? // traiter les outre-mer
    référentiel[codePostal.slice(0, 2)]; // corse & métropole

  return régionDépartement
    ? {
        région: régionDépartement.région,
        département: régionDépartement.département,
        codePostal,
      }
    : undefined;
};

const auvergneRhôneAlpes = 'Auvergne-Rhône-Alpes';
const bourgogneFrancheComté = 'Bourgogne-Franche-Comté';
const bretagne = 'Bretagne';
const centreValDeLoire = 'Centre-Val de Loire';
const corse = 'Corse';
const grandEst = 'Grand Est';
const occitanie = 'Occitanie';
const paca = "Provence-Alpes-Côte d'Azur";
const normandie = 'Normandie';
const nouvelleAquitaine = 'Nouvelle-Aquitaine';
const paysDeLaLoire = 'Pays de la Loire';
const hautsDeFrance = 'Hauts-de-France';
const idf = 'Île-de-France';

const référentiel: Record<string, DépartementRégion> = {
  // Métropole
  '01': { département: 'Ain', région: auvergneRhôneAlpes },
  '02': { département: 'Aisne', région: hautsDeFrance },
  '03': { département: 'Allier', région: auvergneRhôneAlpes },
  '04': { département: 'Alpes-de-Haute-Provence', région: paca },
  '05': { département: 'Hautes-Alpes', région: paca },
  '06': { département: 'Alpes-Maritimes', région: paca },
  '07': { département: 'Ardèche', région: auvergneRhôneAlpes },
  '08': { département: 'Ardennes', région: grandEst },
  '09': { département: 'Ariège', région: occitanie },
  '10': { département: 'Aube', région: grandEst },
  '11': { département: 'Aude', région: occitanie },
  '12': { département: 'Aveyron', région: occitanie },
  '13': { département: 'Bouches-du-Rhône', région: paca },
  '14': { département: 'Calvados', région: normandie },
  '15': { département: 'Cantal', région: auvergneRhôneAlpes },
  '16': { département: 'Charente', région: nouvelleAquitaine },
  '17': { département: 'Charente-Maritime', région: nouvelleAquitaine },
  '18': { département: 'Cher', région: centreValDeLoire },
  '19': { département: 'Corrèze', région: nouvelleAquitaine },
  '21': { département: "Côte-d'Or", région: bourgogneFrancheComté },
  '22': { département: "Côtes-d'Armor", région: bretagne },
  '23': { département: 'Creuse', région: nouvelleAquitaine },
  '24': { département: 'Dordogne', région: nouvelleAquitaine },
  '25': { département: 'Doubs', région: bourgogneFrancheComté },
  '26': { département: 'Drôme', région: auvergneRhôneAlpes },
  '27': { département: 'Eure', région: normandie },
  '28': { département: 'Eure-et-Loir', région: centreValDeLoire },
  '29': { département: 'Finistère', région: bretagne },
  '30': { département: 'Gard', région: occitanie },
  '31': { département: 'Haute-Garonne', région: occitanie },
  '32': { département: 'Gers', région: occitanie },
  '33': { département: 'Gironde', région: nouvelleAquitaine },
  '34': { département: 'Hérault', région: occitanie },
  '35': { département: 'Ille-et-Vilaine', région: bretagne },
  '36': { département: 'Indre', région: centreValDeLoire },
  '37': { département: 'Indre-et-Loire', région: centreValDeLoire },
  '38': { département: 'Isère', région: auvergneRhôneAlpes },
  '39': { département: 'Jura', région: bourgogneFrancheComté },
  '40': { département: 'Landes', région: nouvelleAquitaine },
  '41': { département: 'Loir-et-Cher', région: centreValDeLoire },
  '42': { département: 'Loire', région: auvergneRhôneAlpes },
  '43': { département: 'Haute-Loire', région: auvergneRhôneAlpes },
  '44': { département: 'Loire-Atlantique', région: paysDeLaLoire },
  '45': { département: 'Loiret', région: centreValDeLoire },
  '46': { département: 'Lot', région: occitanie },
  '47': { département: 'Lot-et-Garonne', région: nouvelleAquitaine },
  '48': { département: 'Lozère', région: occitanie },
  '49': { département: 'Maine-et-Loire', région: paysDeLaLoire },
  '50': { département: 'Manche', région: normandie },
  '51': { département: 'Marne', région: grandEst },
  '52': { département: 'Haute-Marne', région: grandEst },
  '53': { département: 'Mayenne', région: paysDeLaLoire },
  '54': { département: 'Meurthe-et-Moselle', région: grandEst },
  '55': { département: 'Meuse', région: grandEst },
  '56': { département: 'Morbihan', région: bretagne },
  '57': { département: 'Moselle', région: grandEst },
  '58': { département: 'Nièvre', région: bourgogneFrancheComté },
  '59': { département: 'Nord', région: hautsDeFrance },
  '60': { département: 'Oise', région: hautsDeFrance },
  '61': { département: 'Orne', région: normandie },
  '62': { département: 'Pas-de-Calais', région: hautsDeFrance },
  '63': { département: 'Puy-de-Dôme', région: auvergneRhôneAlpes },
  '64': { département: 'Pyrénées-Atlantiques', région: nouvelleAquitaine },
  '65': { département: 'Hautes-Pyrénées', région: occitanie },
  '66': { département: 'Pyrénées-Orientales', région: occitanie },
  '67': { département: 'Bas-Rhin', région: grandEst },
  '68': { département: 'Haut-Rhin', région: grandEst },
  '69': { département: 'Rhône', région: auvergneRhôneAlpes },
  '70': { département: 'Haute-Saône', région: bourgogneFrancheComté },
  '71': { département: 'Saône-et-Loire', région: bourgogneFrancheComté },
  '72': { département: 'Sarthe', région: paysDeLaLoire },
  '73': { département: 'Savoie', région: auvergneRhôneAlpes },
  '74': { département: 'Haute-Savoie', région: auvergneRhôneAlpes },
  '75': { département: 'Paris', région: idf },
  '76': { département: 'Seine-Maritime', région: normandie },
  '77': { département: 'Seine-et-Marne', région: idf },
  '78': { département: 'Yvelines', région: idf },
  '79': { département: 'Deux-Sèvres', région: nouvelleAquitaine },
  '80': { département: 'Somme', région: hautsDeFrance },
  '81': { département: 'Tarn', région: occitanie },
  '82': { département: 'Tarn-et-Garonne', région: occitanie },
  '83': { département: 'Var', région: paca },
  '84': { département: 'Vaucluse', région: paca },
  '85': { département: 'Vendée', région: paysDeLaLoire },
  '86': { département: 'Vienne', région: nouvelleAquitaine },
  '87': { département: 'Haute-Vienne', région: nouvelleAquitaine },
  '88': { département: 'Vosges', région: grandEst },
  '89': { département: 'Yonne', région: bourgogneFrancheComté },
  '90': { département: 'Territoire de Belfort', région: bourgogneFrancheComté },
  '91': { département: 'Essonne', région: idf },
  '92': { département: 'Hauts-de-Seine', région: idf },
  '93': { département: 'Seine-Saint-Denis', région: idf },
  '94': { département: 'Val-de-Marne', région: idf },
  '95': { département: "Val-d'Oise", région: idf },

  // Outre mer
  '971': { département: 'Guadeloupe', région: 'Guadeloupe' },
  '972': { département: 'Martinique', région: 'Martinique' },
  '973': { département: 'Guyane', région: 'Guyane' },
  '974': { département: 'La Réunion', région: 'La Réunion' },
  '976': { département: 'Mayotte', région: 'Mayotte' },

  // Corse
  '201': { département: 'Corse-du-Sud', région: corse },
  '202': { département: 'Haute-Corse', région: corse },
  // cas particulier Ajaccio, Furiani, Biguglia
  '20000': { département: 'Corse-du-Sud', région: corse },
  '20090': { département: 'Corse-du-Sud', région: corse },
  '20600': { département: 'Haute-Corse', région: corse },
  '20620': { département: 'Haute-Corse', région: corse },
};
