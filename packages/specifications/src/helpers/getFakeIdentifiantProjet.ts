import { faker } from '@faker-js/faker';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

export const getFakeIdentifiantProjet = () => {
  const appelOffre = faker.helpers.arrayElement(appelsOffreData);
  const période = faker.helpers.arrayElement(appelOffre.periodes);
  return IdentifiantProjet.bind({
    appelOffre: appelOffre.id,
    période: période.id,
    famille:
      période.familles.length === 0
        ? ''
        : (faker.helpers.maybe(() => faker.helpers.arrayElement(période.familles).id) ?? ''),
    numéroCRE: faker.number.int().toString(),
  });
};
