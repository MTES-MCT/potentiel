import { faker } from '@faker-js/faker';

const validSIRET = [
  '42230076433245',
  '93410977806891',
  '44323366342016',
  '37257709800224',
  '19975065437594',
  '20470387088231',
];

export const getFakeNuméroIdentification = (): { siret: string; siren: string } => {
  const siret = faker.helpers.shuffle(validSIRET)[0];
  return {
    siret,
    siren: siret.slice(0, 9),
  };
};
