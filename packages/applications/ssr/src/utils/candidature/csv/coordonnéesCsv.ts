import { Candidature } from '@potentiel-domain/projet';

export const mapCsvRowToCoordonnées = (rawLine: Record<string, string>) => {
  const getValue = (axe: string, part: string) =>
    Object.entries(rawLine).find(([key]) =>
      key.match(new RegExp(`${axe}\\s?\\(${part}\\)`, 'i')),
    )?.[1] || 'NaN';

  const toNumber = (value: string) => +value.replace(',', '.');

  const latitude = {
    degrés: toNumber(getValue('latitude', 'degrés')),
    minutes: toNumber(getValue('latitude', 'minutes')),
    secondes: toNumber(getValue('latitude', 'secondes')),
    cardinal: getValue('latitude', 'cardinal') as 'N' | 'S',
  };

  const longitude = {
    degrés: toNumber(getValue('longitude', 'degrés')),
    minutes: toNumber(getValue('longitude', 'minutes')),
    secondes: toNumber(getValue('longitude', 'secondes')),
    cardinal: getValue('longitude', 'cardinal') as 'E' | 'O',
  };

  try {
    return Candidature.Coordonnées.bind({
      latitude: Candidature.Coordonnées.toDecimal(latitude),
      longitude: Candidature.Coordonnées.toDecimal(longitude),
    }).formatterDecimal();
  } catch {}
};
