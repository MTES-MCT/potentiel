import { faker } from '@faker-js/faker';

import { Région } from '@potentiel-domain/utilisateur';

export const fakeLocations = faker.helpers.multiple(
  () => ({
    codePostal: faker.location.zipCode(),
    commune: faker.location.city(),
    région: faker.helpers.arrayElement(Région.régions),
    département: faker.location.county(),
  }),
  { count: 10 },
);

export const getFakeLocation = () => faker.helpers.arrayElement(fakeLocations);
