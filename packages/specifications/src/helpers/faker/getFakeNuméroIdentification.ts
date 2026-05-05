import { faker } from '@faker-js/faker';

const validSIRET = [
  '422 300 764 33245',
  '934 109 778 06891',
  '443 233 663 42016',
  '372 577 098 00224',
  '199 750 654 37594',
  '204 703 870 88231',
];

export const getFakeNuméroIdentification = (): { siret: string; siren: string } => {
  const siret = faker.helpers.shuffle(validSIRET)[0];
  return {
    siret,
    siren: siret.slice(0, 11),
  };
};
