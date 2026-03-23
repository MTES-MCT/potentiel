import { faker } from '@faker-js/faker';

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
      document: () => { format: string; content: string };
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
