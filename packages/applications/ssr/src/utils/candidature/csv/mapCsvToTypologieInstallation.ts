import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

import {
  InstallationsAgrivoltaiquesCsvShape,
  TypologieBâtimentCsvShape,
  ÉlémentsSousOmbrièreCsvShape,
} from '../candidatureFields.schema';

type GetTypologieInstallation = (args: {
  typeInstallationsAgrivoltaiques: InstallationsAgrivoltaiquesCsvShape;
  typologieDeBâtiment: TypologieBâtimentCsvShape;
  élémentsSousOmbrière: ÉlémentsSousOmbrièreCsvShape;
}) => Array<Candidature.TypologieInstallation.RawType>;

export const mapCsvToTypologieInstallation: GetTypologieInstallation = ({
  typeInstallationsAgrivoltaiques,
  typologieDeBâtiment,
  élémentsSousOmbrière,
}) => {
  const typologiesInstallation: Array<Candidature.TypologieInstallation.RawType> = [];

  if (typeInstallationsAgrivoltaiques) {
    const installationAgrivoltaique = match(typeInstallationsAgrivoltaiques)
      .returnType<Candidature.TypologieInstallation.RawType>()
      .with('culture', () => ({
        typologie: 'agrivoltaique.culture',
      }))
      .with('jachère de plus de 5 ans', () => ({
        typologie: 'agrivoltaique.jachère-plus-de-5-ans',
      }))
      .with('serre', () => ({
        typologie: 'agrivoltaique.serre',
      }))
      .with('élevage', () => ({
        typologie: 'agrivoltaique.élevage',
      }))
      .exhaustive();

    typologiesInstallation.push(installationAgrivoltaique);
  }

  if (typologieDeBâtiment) {
    const typologieBâtiment = match(typologieDeBâtiment)
      .returnType<Candidature.TypologieInstallation.RawType>()
      .with('bâtiment neuf', () => ({
        typologie: 'bâtiment.neuf',
      }))
      .with('bâtiment existant avec rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-avec-rénovation-de-toiture',
      }))
      .with('bâtiment existant sans rénovation de toiture', () => ({
        typologie: 'bâtiment.existant-sans-rénovation-de-toiture',
      }))
      .with('mixte', () => ({
        typologie: 'bâtiment.mixte',
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
