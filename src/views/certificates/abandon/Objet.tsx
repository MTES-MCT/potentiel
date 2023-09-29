import { Text } from '@react-pdf/renderer';
import React from 'react';

export const Objet = () => {
  return (
    <Text style={{ fontWeight: 'bold', marginTop: 30 }}>
      Objet : Abandon d’un projet lauréat de la [NUMERO_PERIODE] période de l’appel d’offres
      [NOM_APPEL_OFFRE] portant [DESCRIPTION_APPEL_OFFRE]
    </Text>
  );
};
