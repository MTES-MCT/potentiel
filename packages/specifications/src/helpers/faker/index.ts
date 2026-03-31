import { faker } from '@faker-js/faker';

import { PièceJustificative } from '../PièceJustificative.js';

import { getFakeDocument } from './getFakeContent.js';
import { getFakeIdentifiantProjet } from './getFakeIdentifiantProjet.js';
import { getFakeLocation } from './getFakeLocation.js';

declare module '@faker-js/faker' {
  interface Faker {
    potentiel: {
      identifiantProjet: typeof getFakeIdentifiantProjet;
      document: () => PièceJustificative;
      location: typeof getFakeLocation;
    };
  }
}

faker.potentiel = {
  identifiantProjet: getFakeIdentifiantProjet,
  document: getFakeDocument,
  location: getFakeLocation,
};
