import { Lauréat } from '@potentiel-domain/projet';

const generateRandomIdentifier = (length: number) =>
  Math.trunc(Math.random() * 10 ** length)
    .toString()
    .padStart(length, '0');

const addLuhnChecksum = (partial: string) => {
  const checksum = Lauréat.Producteur.NuméroIdentification.computeLuhnChecksum(`${partial}0`);
  const checkDigit = checksum === 0 ? 0 : 10 - checksum;
  return `${partial}${checkDigit}`;
};

export const getFakeNuméroIdentification = (): { siret: string; siren: string } => {
  const siren = addLuhnChecksum(generateRandomIdentifier(8));
  const siret = addLuhnChecksum(siren + generateRandomIdentifier(4));
  return { siret, siren };
};
