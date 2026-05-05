import { faker } from '@faker-js/faker';

import { PièceJustificative } from '../PièceJustificative.js';

import { getFakeDocument } from './getFakeContent.js';
import { getFakeIdentifiantProjet } from './getFakeIdentifiantProjet.js';
import { getFakeLocation } from './getFakeLocation.js';
import { getFakeNuméroIdentification } from './getFakeNuméroIdentification.js';

declare module '@faker-js/faker' {
  interface Faker {
    potentiel: {
      identifiantProjet: typeof getFakeIdentifiantProjet;
      document: (contentType?: string) => PièceJustificative;
      location: typeof getFakeLocation;
      numéroIdentification: typeof getFakeNuméroIdentification;
    };
  }
}

faker.potentiel = {
  identifiantProjet: getFakeIdentifiantProjet,
  document: getFakeDocument,
  location: getFakeLocation,
  numéroIdentification: getFakeNuméroIdentification,
};
