import { match } from 'ts-pattern';

import type { Candidature } from '@potentiel-domain/projet';

import type { Champs } from '../../graphql/index.js';

export const getTypologieInstallation = (champs: Champs) => {
  const typologieInstallation: Candidature.TypologieInstallation.RawType[] = [];

  const champTypologie = champs.find(
    (champ) =>
      champ.__typename === 'MultipleDropDownListChamp' &&
      champ.label.trim().toLowerCase() === 'typologie principale du projet',
  );

  const champAgrivoltaïque = champs.find(
    (champ) =>
      champ.__typename === 'CheckboxChamp' &&
      champ.label.trim().toLowerCase() ===
        `l'installation est-elle agrivoltaïque au sens de l’article l. 314-36 du code de l’énergie ?`,
  );

  const champActivitéSousLInstallationAgrivoltaïque = champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' &&
      champ.label.trim().toLowerCase() === `activité sous l'installation`,
  );

  const typologieCultureOuÉlevage = champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' &&
      champ.label.trim().toLowerCase() === `typologie de culture ou d'élevage`,
  );

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

  const typologiesPrincipales = champTypologie?.stringValue
    ?.toLowerCase()
    .split(',')
    .map((t) => t.trim());
  if (typologiesPrincipales?.includes('installation au sol')) {
    const typologie: Candidature.TypologieInstallation.RawType = { typologie: 'sol' };
    typologieInstallation.push(typologie);
  }

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
      .with('ombrière agrivoltaïque', () => ({
        typologie: 'ombrière.agrivoltaïque',
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

  if (champAgrivoltaïque?.stringValue === 'true') {
    if (champActivitéSousLInstallationAgrivoltaïque?.stringValue) {
      const typologie = match(
        champActivitéSousLInstallationAgrivoltaïque.stringValue.trim().toLowerCase(),
      )
        .returnType<Candidature.TypologieInstallation.RawType>()
        .with('cultures', () => ({
          typologie: 'agrivoltaïque.culture',
          détails: typologieCultureOuÉlevage?.stringValue?.trim(),
        }))
        .with('élevage', () => ({
          typologie: 'agrivoltaïque.élevage',
          détails: typologieCultureOuÉlevage?.stringValue?.trim(),
        }))
        .otherwise(() => ({
          typologie: 'agrivoltaïque.non-précisé',
        }));
      typologieInstallation.push(typologie);
    } else {
      typologieInstallation.push({ typologie: 'agrivoltaïque.non-précisé' });
    }
  }

  return typologieInstallation;
};
