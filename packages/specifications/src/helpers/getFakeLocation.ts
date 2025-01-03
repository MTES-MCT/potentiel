import { faker } from '@faker-js/faker';

export const fakeLocations = faker.helpers.multiple(
  () => ({
    codePostal: faker.location.zipCode(),
    commune: faker.location.city(),
    région: faker.location.state(),
    département: faker.location.state(),
  }),
  { count: 10 },
);

export const getFakeLocation = () => faker.helpers.arrayElement(fakeLocations);
