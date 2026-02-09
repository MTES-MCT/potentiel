import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

import { Champs } from '../../graphql/index.js';

export const getTypologieInstallation = (champs: Champs) => {
  const typologieInstallation: Candidature.TypologieInstallation.RawType[] = [];

  const champTypologieBâtiment = champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' &&
      champ.label.trim().toLowerCase() === 'typologie secondaire du projet (bâtiment)',
  );

  const champTypologieOmbrière = champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' &&
      champ.label.trim().toLowerCase() === 'typologie secondaire du projet (ombrière)',
  );

  const champÉlémentsSousOmbrière = champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' &&
      champ.label.trim().toLowerCase() === "préciser les éléments sous l'ombrière",
  );

  const champÉlémentsSousSerre = champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' &&
      champ.label.trim().toLowerCase() === 'préciser les éléments sous la serre',
  );

  if (champTypologieBâtiment?.stringValue) {
    const typologie = match(champTypologieBâtiment.stringValue.trim().toLowerCase())
      .returnType<Candidature.TypologieInstallation.RawType | undefined>()
      .with('stabulation visant à loger du bétail', () => ({
        typologie: 'bâtiment.stabulation',
      }))
      .with('bâtiment neuf', () => ({
        typologie: 'bâtiment.neuf',
      }))
      .with('bâtiment existant avec rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
      }))
      .with('bâtiment existant sans rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-sans-rénovation-de-toiture',
      }))
      .with('serre agricole', () => ({
        typologie: 'bâtiment.serre',
        détails: champÉlémentsSousSerre?.stringValue?.trim(),
      }))
      .otherwise(() => undefined);
    if (typologie) {
      typologieInstallation.push(typologie);
    }
  }

  if (champTypologieOmbrière?.stringValue) {
    const typologie = match(champTypologieOmbrière.stringValue.trim().toLowerCase())
      .returnType<Candidature.TypologieInstallation.RawType | undefined>()
      .with('ombrière sur parking', () => ({
        typologie: 'ombrière.parking',
      }))
      .with('ombrière autre', () => ({
        typologie: 'ombrière.autre',
        détails: champÉlémentsSousOmbrière?.stringValue?.trim(),
      }))
      .with('ombrière mixte (sur parking et autre)', () => ({
        typologie: 'ombrière.mixte',
        détails: champÉlémentsSousOmbrière?.stringValue?.trim(),
      }))
      .otherwise(() => undefined);
    if (typologie) {
      typologieInstallation.push(typologie);
    }
  }

  return typologieInstallation;
};
