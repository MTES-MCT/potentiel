import { faker } from '@faker-js/faker';

import { PièceJustificative } from '../PièceJustificative.js';

import { getFakeContent, getFakeDocument } from './getFakeContent.js';
import { getFakeFormat } from './getFakeFormat.js';
import { getFakeIdentifiantProjet } from './getFakeIdentifiantProjet.js';
import { getFakeLocation } from './getFakeLocation.js';

declare module '@faker-js/faker' {
  interface Faker {
    potentiel: {
      identifiantProjet: typeof getFakeIdentifiantProjet;
      fileFormat: () => string;
      fileContent: () => ReadableStream;
      document: () => PièceJustificative;
      location: typeof getFakeLocation;
    };
  }
}

faker.potentiel = {
  fileFormat: getFakeFormat,
  identifiantProjet: getFakeIdentifiantProjet,
  fileContent: getFakeContent,
  document: getFakeDocument,
  location: getFakeLocation,
};
