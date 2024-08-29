import { faker } from '@faker-js/faker';

import { IdentifiantProjet } from '@potentiel-domain/common';

export const getFakeIdentifiantProjet = (): string => {
  return IdentifiantProjet.bind({
    appelOffre: faker.number.int().toString(),
    famille: faker.number.int().toString(),
    numéroCRE: faker.number.int().toString(),
    période: faker.number.int().toString(),
  }).formatter();
};
