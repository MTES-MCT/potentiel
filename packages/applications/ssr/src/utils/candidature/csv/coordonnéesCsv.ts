import { Candidature } from '@potentiel-domain/projet';

export const mapCsvRowToCoordonnées = (rawLine: Record<string, string>) => {
  const getValue = (axe: string, part: string) =>
    Object.entries(rawLine).find(([key]) =>
      key.match(new RegExp(`${axe}\\s?\\(${part}\\)`, 'i')),
    )?.[1] || NaN;

  const latitude = {
    degrés: +getValue('latitude', 'degrés'),
    minutes: +getValue('latitude', 'minutes'),
    secondes: +getValue('latitude', 'secondes'),
    cardinal: getValue('latitude', 'cardinal') as 'N' | 'S',
  };

  const longitude = {
    degrés: +getValue('longitude', 'degrés'),
    minutes: +getValue('longitude', 'minutes'),
    secondes: +getValue('longitude', 'secondes'),
    cardinal: getValue('longitude', 'cardinal') as 'E' | 'O',
  };

  try {
    return Candidature.Coordonnées.bind({
      latitude: Candidature.Coordonnées.toDecimal(latitude),
      longitude: Candidature.Coordonnées.toDecimal(longitude),
    }).formatterDecimal();
  } catch {}
};
