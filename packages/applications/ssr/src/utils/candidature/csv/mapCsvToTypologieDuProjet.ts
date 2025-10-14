import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

import {
  InstallationsAgrivoltaïquesCsvShape,
  TypologieBâtimentCsvShape,
  ÉlémentsSousOmbrièreCsvShape,
} from './candidatureCsvFields.schema';

type GetTypologieDuProjet = (args: {
  typeInstallationsAgrivoltaïques: InstallationsAgrivoltaïquesCsvShape;
  typologieDeBâtiment: TypologieBâtimentCsvShape;
  élémentsSousOmbrière: ÉlémentsSousOmbrièreCsvShape;
}) => Array<Candidature.TypologieDuProjet.RawType>;

export const mapCsvToTypologieDuProjet: GetTypologieDuProjet = ({
  typeInstallationsAgrivoltaïques,
  typologieDeBâtiment,
  élémentsSousOmbrière,
}) => {
  const typologiesInstallation: Array<Candidature.TypologieDuProjet.RawType> = [];

  if (typeInstallationsAgrivoltaïques) {
    const installationAgrivoltaïque = match(typeInstallationsAgrivoltaïques)
      .returnType<Candidature.TypologieDuProjet.RawType>()
      .with('culture', () => ({
        typologie: 'agrivoltaïque.culture',
      }))
      .with('jachère de plus de 5 ans', () => ({
        typologie: 'agrivoltaïque.jachère-plus-de-5-ans',
      }))
      .with('serre', () => ({
        typologie: 'agrivoltaïque.serre',
      }))
      .with('élevage', () => ({
        typologie: 'agrivoltaïque.élevage',
      }))
      .exhaustive();

    typologiesInstallation.push(installationAgrivoltaïque);
  }

  if (typologieDeBâtiment) {
    const typologieBâtiment = match(typologieDeBâtiment)
      .returnType<Candidature.TypologieDuProjet.RawType>()
      .with('bâtiment neuf', () => ({
        typologie: 'bâtiment.neuf',
      }))
      .with('bâtiment existant avec rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
      }))
      .with('bâtiment existant sans rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-sans-rénovation-de-toiture',
      }))
      .exhaustive();

    typologiesInstallation.push(typologieBâtiment);
  }

  if (élémentsSousOmbrière) {
    typologiesInstallation.push({
      typologie: 'ombrière.autre',
      détails: élémentsSousOmbrière,
    });
  }

  return typologiesInstallation;
};
