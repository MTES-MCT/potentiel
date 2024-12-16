import { faker } from '@faker-js/faker';

export { faker };

export const cities = faker.helpers.multiple(
  () => ({
    codePostal: faker.location.zipCode(),
    commune: faker.location.city(),
    région: faker.location.state(),
    département: faker.location.state(),
  }),
  { count: 10 },
);
