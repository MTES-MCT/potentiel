import { Candidature } from '@potentiel-domain/projet';

import { Champs, createDossierAccessor } from '../../graphql/index.js';

const map = {
  latitude_degrés: 'Latitude du barycentre (degrés)',
  latitude_minutes: 'Latitude du barycentre (minutes)',
  latitude_secondes: 'Latitude du barycentre (secondes)',
  latitude_cardinal: 'Latitude du barycentre (point cardinal)',

  longitude_degrés: 'Longitude du barycentre (degrés)',
  longitude_minutes: 'Longitude du barycentre (minutes)',
  longitude_secondes: 'Longitude du barycentre (secondes)',
  longitude_cardinal: 'Longitude du barycentre (point cardinal)',
};

export const getCoordonnées = (champs: Champs) => {
  const accessor = createDossierAccessor(champs, map);
  const latitude = {
    degrés: accessor.getNumberValue('latitude_degrés') ?? -Infinity,
    minutes: accessor.getNumberValue('latitude_minutes') ?? -Infinity,
    secondes: accessor.getNumberValue('latitude_secondes') ?? -Infinity,
    cardinal: accessor.getStringValue('latitude_cardinal') as 'N' | 'S',
  };
  const longitude = {
    degrés: accessor.getNumberValue('longitude_degrés') ?? -Infinity,
    minutes: accessor.getNumberValue('longitude_minutes') ?? -Infinity,
    secondes: accessor.getNumberValue('longitude_secondes') ?? -Infinity,
    cardinal: accessor.getStringValue('longitude_cardinal') as 'E' | 'O',
  };

  try {
    return Candidature.Coordonnées.bind({
      latitude: Candidature.Coordonnées.toDecimal(latitude),
      longitude: Candidature.Coordonnées.toDecimal(longitude),
    }).formatterDecimal();
  } catch {}
};
